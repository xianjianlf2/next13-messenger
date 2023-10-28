import getCurrentUser from '@/app/actions/getCurrentUser'
import { NextResponse } from 'next/server'
import prisma from '@/app/libs/prismadb'
import { pusherServer } from '@/app/libs/pusher'

export async function POST(request: Request) {
  const currentUser = await getCurrentUser()
  const body = await request.json()

  const { message, image, conversationId } = body
  try {
    if (!currentUser?.id || !currentUser.email) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const newMessage = await prisma.message.create({
      data: {
        body: message,
        image,
        conversation: {
          connect: {
            id: conversationId
          }
        },
        sender: {
          connect: {
            id: currentUser.id
          }
        },
        seen: {
          connect: {
            id: currentUser.id
          }
        }
      },
      include: {
        sender: true,
        seen: true
      }
    })

    const updateConversation = await prisma.conversation.update({
      where: {
        id: conversationId
      },
      data: {
        lastMessageAt: new Date(),
        messages: {
          connect: {
            id: newMessage.id
          }
        }
      },
      include: {
        users: true,
        messages: {
          include: {
            seen: true
          }
        }
      }
    })
    await pusherServer.trigger(conversationId, 'messages:new', newMessage)

    const lastMessage =
      updateConversation.messages[updateConversation.messages.length - 1]

    // Update all connections with new seen
    updateConversation.users.map((user) => {
      pusherServer.trigger(user.email!, 'conversation:update', {
        id: conversationId,
        message: [lastMessage]
      })
    })

    return NextResponse.json(newMessage)
  } catch (error) {
    console.log(error, 'ERROR_MESSAGE')
    return new NextResponse('InternalError', { status: 500 })
  }
}
