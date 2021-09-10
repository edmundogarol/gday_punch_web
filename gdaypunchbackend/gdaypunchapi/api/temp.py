def PaymentsWebhookHandler(request):
    payload = request.body
    event = None

    try:
        sig_header = request.META['HTTP_STRIPE_SIGNATURE']

        event = stripe.Webhook.construct_event(
            payload, sig_header, endpoint_secret
        )
    except ValueError as e:
        # Invalid payload
        return HttpResponse(status=400)
        # Invalid signature
    except stripe.error.SignatureVerificationError as e:
        return HttpResponse(status=400)
    except KeyError:
        return HttpResponse(status=400)

    # Handle payment intent succeeded
    if event['type'] == 'payment_intent.succeeded':
        payment_intent = event['data']['object']

        print(payment_intent)

    # Handle checkout complete
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']

        customer_id = session.customer
        customer_email = session.customer_details.email
        payment_email_exists = False
        subscription_payment = False
        transaction = None

        shipping = session.shipping.address
        billing = None

        if session.payment_intent is None:
            transaction = stripe.Subscription.retrieve(session.subscription)
            subscription_payment = True
        else:
            transaction = stripe.PaymentIntent.retrieve(session.payment_intent)

        if subscription_payment:
            payment_method = stripe.PaymentMethod.retrieve(
                transaction.default_payment_method)
            billing = payment_method.billing_details.address
        else:
            billing = transaction.charges.data[0].billing_details.address

        line_items = stripe.checkout.Session.list_line_items(session.id)

        print('session', session)
        print('transaction', transaction)

        print('line_items', line_items)
        print('shipping', shipping)
        print('billing', billing)

        # Get GP_StripeCustomer with checkout email or customer_id
        stripe_customer = StripeCustomer.objects.filter(
            Q(stripe_email=customer_email) | Q(customer_id=customer_id)
        ).first()

        # User is buying a product with an email that exists as a GP_StripeCustomer
        if stripe_customer and stripe_customer.customer_id != transaction.customer:
            stripe_customer = None
            payment_email_exists = True
            print(
                'Unregistered payment email is associated with a GP_StripeCustomer')

        # GP_StripeCustomer is making a payment
        if stripe_customer:
            try:
                # If GP_StripeCustomer is associated with a user
                user = User.objects.get(id=stripe_customer.user_id)

                # If GP_StripeCustomer is using another email - update GP_StripeCustomer
                if stripe_customer.stripe_email != customer_email:
                    stripe_customer.stripe_email = customer_email
                    stripe_customer.save()

                    handle_create_order()

            except User.DoesNotExist:
                print("GP_StripeCustomer not associated with user ")

                stripe_customer.user = None
                stripe_customer.stripe_email = customer_email
                stripe_customer.save()

        else:
            try:
                # If payment email is associated with a user
                user = User.objects.get(email=customer_email)

                # Payment email associated with existing GP_StripeCustomer,
                # delete new payment customer
                if payment_email_exists:
                    stripe_customer = StripeCustomer.objects.get(
                        stripe_email=customer_email)

                    stripe.Customer.delete(transaction.customer)

                else:
                    stripe_customer = StripeCustomer(
                        customer_id=customer_id,
                        stripe_email=customer_email,
                        user=user
                    )
                    stripe_customer.save()

            except User.DoesNotExist:
                print("Payment email is not associated with user ")

                # Payment email associated with existing GP_StripeCustomer,
                # delete new payment customer
                if payment_email_exists:
                    stripe_customer = StripeCustomer.objects.get(
                        stripe_email=customer_email)

                    stripe.Customer.delete(transaction.customer)

                else:
                    stripe_customer = StripeCustomer(
                        customer_id=customer_id,
                        stripe_email=customer_email,
                        user=None
                    )
                    stripe_customer.save()

    else:
        if 'DEVENV' in os.environ:
            print('Unhandled event type {}'.format(event.type))

    return HttpResponse(status=200)
