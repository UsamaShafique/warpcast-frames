import { FrameRequest, getFrameHtmlResponse } from '@coinbase/onchainkit/frame'
import { NextRequest, NextResponse } from 'next/server'
import { checkAvailability } from '@/app/utils'

async function getResponse(req: NextRequest): Promise<NextResponse> {
    const body: FrameRequest = await req.json()

    const { untrustedData } = body
    const isHashtagAvailable = await checkAvailability(body)

    if (isHashtagAvailable === true) {
        const searchParams = new URLSearchParams({
            title: 'Hashtag taken already!',
        })

        return new NextResponse(
            getFrameHtmlResponse({
                buttons: [
                    {
                        label: 'Try Again',
                    },
                ],
                image: {
                    src: `${process.env.NEXT_PUBLIC_SITE_URL}/og?${searchParams}`,
                },
                input: {
                    text: 'Your #Hashtag',
                },
                postUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/api/advanced`,
            })
        )
    }

    if (isHashtagAvailable === false) {
        return new NextResponse(
            getFrameHtmlResponse({
                buttons: [
                    {
                        label: 'Mint',
                    },
                ],
                image: {
                    src: `${process.env.NEXT_PUBLIC_SITE_URL}/park-4.png`,
                },
                input: {
                    text: 'Your #Hashtag',
                },
                postUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/api/mint`,
            })
        )
    }

    const searchParams = new URLSearchParams({
        title: 'How you even reach here ?',
        description: untrustedData.inputText,
    })

    return new NextResponse(
        getFrameHtmlResponse({
            image: {
                src: `${process.env.NEXT_PUBLIC_SITE_URL}/og?${searchParams}`,
            },
        })
    )
}

export async function POST(req: NextRequest): Promise<Response> {
    return getResponse(req)
}

export const dynamic = 'force-dynamic'