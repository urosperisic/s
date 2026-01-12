# accounts/views.py

from django.conf import settings
from django.contrib.auth import authenticate, get_user_model
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from .permissions import IsAdmin

User = get_user_model()


@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')

    if User.objects.filter(username=username).exists():
        return Response(
            {'detail': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST
        )

    user = User.objects.create_user(username=username, email=email, password=password)

    return Response(
        {
            'detail': 'Registration successful',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'role': user.role,
            },
        },
        status=status.HTTP_201_CREATED,
    )


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(username=username, password=password)

    if user is None:
        return Response(
            {'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED
        )

    refresh = RefreshToken.for_user(user)
    access_token = str(refresh.access_token)
    refresh_token = str(refresh)

    response = Response(
        {
            'detail': 'Login successful',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'role': user.role,
            },
        }
    )

    # Set cookies
    response.set_cookie(
        key=settings.SIMPLE_JWT['AUTH_COOKIE'],
        value=access_token,
        max_age=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'].total_seconds(),
        secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
        httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
        samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'],
    )

    response.set_cookie(
        key=settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'],
        value=refresh_token,
        max_age=settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'].total_seconds(),
        secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
        httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
        samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'],
    )

    return response


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    response = Response({'detail': 'Logout successful'})
    response.delete_cookie(settings.SIMPLE_JWT['AUTH_COOKIE'])
    response.delete_cookie(settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'])
    return response


@api_view(['POST'])
@permission_classes([AllowAny])
def refresh_view(request):
    refresh_token = request.COOKIES.get(settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'])

    if refresh_token is None:
        return Response(
            {'detail': 'Refresh token not found'}, status=status.HTTP_401_UNAUTHORIZED
        )

    try:
        refresh = RefreshToken(refresh_token)
        access_token = str(refresh.access_token)

        response = Response({'detail': 'Token refreshed'})
        response.set_cookie(
            key=settings.SIMPLE_JWT['AUTH_COOKIE'],
            value=access_token,
            max_age=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'].total_seconds(),
            secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
            httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
            samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'],
        )

        return response

    except Exception:
        return Response(
            {'detail': 'Invalid refresh token'}, status=status.HTTP_401_UNAUTHORIZED
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_view(request):
    user = request.user
    return Response(
        {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'role': user.role,
        }
    )


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdmin])
def list_users_view(request):
    users = User.objects.all().order_by('-date_joined')
    users_data = [
        {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'role': user.role,
            'date_joined': user.date_joined,
        }
        for user in users
    ]
    return Response(users_data)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated, IsAdmin])
def delete_user_view(request, user_id):
    try:
        user = User.objects.get(id=user_id)

        # Prevent admin from deleting themselves
        if user.id == request.user.id:
            return Response(
                {'detail': 'Cannot delete yourself'}, status=status.HTTP_400_BAD_REQUEST
            )

        user.delete()
        return Response({'detail': 'User deleted successfully'})

    except User.DoesNotExist:
        return Response({'detail': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
