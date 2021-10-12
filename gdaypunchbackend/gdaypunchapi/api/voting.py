from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import exceptions
from rest_framework.permissions import IsAuthenticated

from ..utils import AdminOrReadOnly, AdminOnly
from ..constants import *

from ..models import User, Customer, VotingRound, Vote, Purchase, Product
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
        for idx in range(1, 10):
            item_has_vote = getattr(voting_round, 'item' + str(idx), None)

            if item_has_vote:
                items.append({
                    'idx': idx,
                    'item': VotingItemSerializer(item_has_vote).data
                })

        if customer:
            try:
                vote = Vote.objects.get(customer=customer.id)

                for idx in range(1, 10):
                    item_has_vote = getattr(vote, 'item' + str(idx), None)

                    if item_has_vote:
                        customer_vote.append({
                            'item': idx,
                            'value': item_has_vote
                        })

            except Vote.DoesNotExist:
                pass

        try:
            corresponding_digital = Product.objects.get(
                sku='GPMMD' + str(voting_round.issue))
            purchased = voting_round.product.purchased or corresponding_digital.purchased
        except Product.DoesNotExist:
            purchased = False

        return Response(
            {
                'issue_number': voting_round.issue,
                'items': items,
                'cast': customer_vote,
                'disabled': not purchased,
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


class VotingDashboard(APIView):
    permission_classes = [AdminOnly]

    def get(self, request, format=None):

        voting_round = VotingRound.objects.order_by('id')[0]

        items = []
        for idx in range(1, 10):
            item_has_vote = getattr(voting_round, 'item' + str(idx), None)

            if item_has_vote:
                items.append({
                    'idx': idx,
                    'item': VotingItemSerializer(item_has_vote).data
                })

        votes = Vote.objects.filter(
            voting_round=voting_round.id).order_by('-id')[:10]
        latest_10 = []

        for vote in votes:
            current_vote = {
                'customer': vote.customer.email,
                'created_date': vote.readable_date
            }

            def structure_vote(idx):
                item = getattr(vote, 'item' + str(idx), None)
                current_vote['item' + str(idx)] = {
                    'idx': idx,
                    'value': item,
                }

            for idx in range(1, 10):
                item_has_vote = getattr(vote, 'item' + str(idx), None)

                if item_has_vote:
                    structure_vote(idx)

            latest_10.append(current_vote)

        all_votes = Vote.objects.filter(
            voting_round=voting_round.id).order_by('-id')

        vote_tally = {
            'count': len(all_votes)
        }

        def get_position_value(pos):
            if pos == 1:
                return 3
            elif pos == 2:
                return 2
            elif pos == 3:
                return 1

        for vote in all_votes:
            def add_to_tally_idx(idx):
                item = getattr(vote, 'item' + str(idx), None)

                if item:
                    current_idx_tally = 0

                    try:
                        current_idx_tally = vote_tally['item' + str(idx)]
                    except KeyError:
                        pass

                    vote_tally['item' +
                               str(idx)] = int(current_idx_tally) + int(get_position_value(item))

            for idx in range(1, 10):
                item_has_vote = getattr(vote, 'item' + str(idx), None)

                if item_has_vote:
                    add_to_tally_idx(idx)

        return Response(
            {
                'issue_number': voting_round.issue,
                'items': items,
                'latest_10': latest_10,
                'vote_tally': vote_tally,
            },
            status=status.HTTP_200_OK
        )
