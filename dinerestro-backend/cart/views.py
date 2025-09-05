import uuid
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import CartModel, CartItemModel
from foods.models import FoodModel
from .serializers import CartSerializer, AddItemSerializer, UpdateItemSerializer
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django.shortcuts import get_object_or_404

class CreateCartView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def post(self, request):
        user = request.user if request.user.is_authenticated else None
        cart_key = None if user else uuid.uuid4()  # Only generate cart_key for anonymous users
        cart = CartModel.objects.create(user=user, cart_key=cart_key)
        serializer = CartSerializer(cart)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class CartDetailView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request, cart_id):
        cart = get_object_or_404(CartModel, id=cart_id)
        if request.user.is_authenticated and cart.user != request.user:
            return Response({'error': 'Unauthorized: Cart does not belong to user'}, status=status.HTTP_403_FORBIDDEN)
        if not request.user.is_authenticated and str(cart.cart_key) != request.query_params.get('cart_key'):
            return Response({'error': 'Invalid cart_key'}, status=status.HTTP_401_UNAUTHORIZED)
        serializer = CartSerializer(cart)
        return Response(serializer.data)

class AddItemView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def post(self, request, cart_id):
        cart = get_object_or_404(CartModel, id=cart_id)
        if request.user.is_authenticated and cart.user != request.user:
            return Response({'error': 'Unauthorized: Cart does not belong to user'}, status=status.HTTP_403_FORBIDDEN)
        if not request.user.is_authenticated and str(cart.cart_key) != request.query_params.get('cart_key'):
            return Response({'error': 'Invalid cart_key'}, status=status.HTTP_401_UNAUTHORIZED)

        serializer = AddItemSerializer(data=request.data)
        if serializer.is_valid():
            item_id = serializer.validated_data['item_id']
            quantity = serializer.validated_data['quantity']
            try:
                food_item = FoodModel.objects.get(id=item_id)
            except FoodModel.DoesNotExist:
                return Response({'error': 'Food item not found'}, status=status.HTTP_404_NOT_FOUND)

            if food_item.price <= 0:
                return Response({'error': 'Invalid food item price'}, status=status.HTTP_400_BAD_REQUEST)

            cart_item, created = CartItemModel.objects.get_or_create(
                cart=cart,
                item=food_item,
                defaults={'price_at_time': food_item.price, 'quantity': quantity}
            )
            if not created:
                cart_item.quantity += quantity
                cart_item.price_at_time = food_item.price
                cart_item.save()

            serializer = CartSerializer(cart)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UpdateItemView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def put(self, request, cart_id):
        cart = get_object_or_404(CartModel, id=cart_id)
        if request.user.is_authenticated and cart.user != request.user:
            return Response({'error': 'Unauthorized: Cart does not belong to user'}, status=status.HTTP_403_FORBIDDEN)
        if not request.user.is_authenticated and str(cart.cart_key) != request.query_params.get('cart_key'):
            return Response({'error': 'Invalid cart_key'}, status=status.HTTP_401_UNAUTHORIZED)

        serializer = UpdateItemSerializer(data=request.data)
        if serializer.is_valid():
            item_id = serializer.validated_data['item_id']
            quantity = serializer.validated_data['quantity']
            try:
                cart_item = CartItemModel.objects.get(cart=cart, item__id=item_id)
            except CartItemModel.DoesNotExist:
                return Response({'error': 'Item not in cart'}, status=status.HTTP_404_NOT_FOUND)

            if quantity == 0:
                cart_item.delete()
            else:
                cart_item.quantity = quantity
                cart_item.save()

            serializer = CartSerializer(cart)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class RemoveItemView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def delete(self, request, cart_id, item_id):
        cart = get_object_or_404(CartModel, id=cart_id)
        if request.user.is_authenticated and cart.user != request.user:
            return Response({'error': 'Unauthorized: Cart does not belong to user'}, status=status.HTTP_403_FORBIDDEN)
        if not request.user.is_authenticated and str(cart.cart_key) != request.query_params.get('cart_key'):
            return Response({'error': 'Invalid cart_key'}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            cart_item = CartItemModel.objects.get(cart=cart, item__id=item_id)
            cart_item.delete()
            serializer = CartSerializer(cart)
            return Response(serializer.data)
        except CartItemModel.DoesNotExist:
            return Response({'error': 'Item not in cart'}, status=status.HTTP_404_NOT_FOUND)