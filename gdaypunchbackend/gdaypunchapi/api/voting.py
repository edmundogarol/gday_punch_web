from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import exceptions
from rest_framework.permissions import IsAuthenticated

from ..utils import AdminOrReadOnly
from ..constants import *

from ..models import User, Customer, VotingRound, Vote, Purchase
from ..serializers import VotingItemSerializer


class VotingSystemDetailsViewSet(APIView):
    permission_classes = [AdminOrReadOnly]

    def get(self, request, format=None):
        user = None
        customer = None
        customer_vote = []

        try:
            user = User.objects.get(email=str(self.request.user))
        except User.DoesNotExist:
            pass

        if user:
            try:
                customer = Customer.objects.get(user=user.id)
            except Customer.DoesNotExist:
                pass

        voting_round = VotingRound.objects.order_by('id')[0]

        items = []
        items.append({
            'idx': 1,
            'item': VotingItemSerializer(voting_round.item1).data
        })
        items.append({
            'idx': 2,
            'item': VotingItemSerializer(voting_round.item2).data
        })
        items.append({
            'idx': 3,
            'item': VotingItemSerializer(voting_round.item3).data
        })

        if voting_round.item4:
            items.append({
                'idx': 4,
                'item': VotingItemSerializer(voting_round.item4).data
            })
        if voting_round.item5:
            items.append({
                'idx': 5,
                'item': VotingItemSerializer(voting_round.item5).data
            })
        if voting_round.item6:
            items.append({
                'idx': 6,
                'item': VotingItemSerializer(voting_round.item6).data
            })
        if voting_round.item7:
            items.append({
                'idx': 7,
                'item': VotingItemSerializer(voting_round.item7).data
            })
        if voting_round.item8:
            items.append({
                'idx': 8,
                'item': VotingItemSerializer(voting_round.item8).data
            })
        if voting_round.item9:
            items.append({
                'idx': 9,
                'item': VotingItemSerializer(voting_round.item9).data
            })
        if voting_round.item10:
            items.append({
                'idx': 10,
                'item': VotingItemSerializer(voting_round.item10).data
            })

        if customer:
            try:
                vote = Vote.objects.get(customer=customer.id)

                if vote.item1:
                    customer_vote.append({
                        'item': 1,
                        'value': vote.item1
                    })
                if vote.item2:
                    customer_vote.append({
                        'item': 2,
                        'value': vote.item2
                    })
                if vote.item3:
                    customer_vote.append({
                        'item': 3,
                        'value': vote.item3
                    })
                if vote.item4:
                    customer_vote.append({
                        'item': 4,
                        'value': vote.item4
                    })
                if vote.item5:
                    customer_vote.append({
                        'item': 5,
                        'value': vote.item5
                    })
                if vote.item6:
                    customer_vote.append({
                        'item': 6,
                        'value': vote.item6
                    })
                if vote.item7:
                    customer_vote.append({
                        'item': 7,
                        'value': vote.item7
                    })
                if vote.item8:
                    customer_vote.append({
                        'item': 8,
                        'value': vote.item8
                    })
                if vote.item9:
                    customer_vote.append({
                        'item': 9,
                        'value': vote.item9
                    })
                if vote.item10:
                    customer_vote.append({
                        'item': 10,
                        'value': vote.item10
                    })

            except Vote.DoesNotExist:
                pass

        return Response(
            {
                'issue_number': voting_round.issue,
                'items': items,
                'cast': customer_vote,
                'disabled': not voting_round.product.purchased,
            },
            status=status.HTTP_200_OK
        )


class VoteCastingViewSet(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        vote = request.data.get('vote', None)
        purchase_reason = request.data.get('purchase_reason', None)

        user = None
        customer = None
        customer_vote = None

        if vote is None:
            Response({'error': 'Must provide vote items.'},
                     status=status.HTTP_406_NOT_ACCEPTABLE)

        try:
            user = User.objects.get(email=str(self.request.user))
        except User.DoesNotExist:
            return Response({'error': 'Must be logged in to vote.'}, status=status.HTTP_401_UNAUTHORIZED)

        if user:
            try:
                customer = Customer.objects.get(user=user.id)
            except Customer.DoesNotExist:
                return Response({'error': 'Voter must have this issue purchased as a customer.'}, status=status.HTTP_400_BAD_REQUEST)

        voting_round = VotingRound.objects.order_by('id')[0]

        item1 = None
        item2 = None
        item3 = None
        item4 = None
        item5 = None
        item6 = None
        item7 = None
        item8 = None
        item9 = None
        item10 = None

        for idx, item in enumerate(vote):
            if item == 1:
                item1 = idx + 1
            if item == 2:
                item2 = idx + 1
            if item == 3:
                item3 = idx + 1
            if item == 4:
                item4 = idx + 1
            if item == 5:
                item5 = idx + 1
            if item == 6:
                item6 = idx + 1
            if item == 7:
                item7 = idx + 1
            if item == 8:
                item8 = idx + 1
            if item == 9:
                item9 = idx + 1
            if item == 10:
                item10 = idx + 1

        new_vote = Vote.objects.create(
            customer=customer,
            voting_round=voting_round,
            purchase_reason=purchase_reason,
            item1=item1,
            item2=item2,
            item3=item3,
            item4=item4,
            item5=item5,
            item6=item6,
            item7=item7,
            item8=item8,
            item9=item9,
            item10=item10,
        )

        return Response(
            {'detail': 'Your vote has successfully been cast!'},
            status=status.HTTP_200_OK
        )
