from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import exceptions

from ..utils import AdminOrReadOnly
from ..constants import *

from ..models import User, Customer, VotingRound, Vote
from ..serializers import VotingItemSerializer


class VotingSystemDetailsViewSet(APIView):
    permission_classes = [AdminOrReadOnly]

    def get(self, request, format=None):
        user = None
        customer = None
        customer_vote = None

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
                        'value': voting_round.item1
                    })
                if vote.item2:
                    customer_vote.append({
                        'item': 2,
                        'value': voting_round.item2
                    })
                if vote.item3:
                    customer_vote.append({
                        'item': 3,
                        'value': voting_round.item3
                    })
                if vote.item4:
                    customer_vote.append({
                        'item': 4,
                        'value': voting_round.item4
                    })
                if vote.item5:
                    customer_vote.append({
                        'item': 5,
                        'value': voting_round.item5
                    })
                if vote.item6:
                    customer_vote.append({
                        'item': 6,
                        'value': voting_round.item6
                    })
                if vote.item7:
                    customer_vote.append({
                        'item': 7,
                        'value': voting_round.item7
                    })
                if vote.item8:
                    customer_vote.append({
                        'item': 8,
                        'value': voting_round.item8
                    })
                if vote.item9:
                    customer_vote.append({
                        'item': 9,
                        'value': voting_round.item9
                    })
                if vote.item10:
                    customer_vote.append({
                        'item': 10,
                        'value': voting_round.item10
                    })

            except Vote.DoesNotExist:
                pass

        return Response(
            {
                'issue_number': voting_round.issue,
                'items': items,
                'cast': customer_vote,
            },
            status=status.HTTP_200_OK
        )

        # return Response({'error': 'Must provide email to send download link to.'}, status=status.HTTP_406_NOT_ACCEPTABLE)

        # return Response({'detail': 'We have sent you an email with the download link! Please check your junk folder.'}, status=status.HTTP_208_ALREADY_REPORTED)

        # return Response(
        #     {'detail': 'We have sent you an email with the download link! Please check your junk folder.'},
        #     status=status.HTTP_200_OK
        # )
