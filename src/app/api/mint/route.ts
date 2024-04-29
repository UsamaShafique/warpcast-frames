import { NextRequest, NextResponse } from "next/server";
import { FrameRequest, getFrameHtmlResponse } from '@coinbase/onchainkit/frame'
import { mintHashtags } from "@/app/utils";


async function getResponse(req: NextRequest): Promise<NextResponse> {
    const body: FrameRequest = await req.json();
    const { untrustedData } = body
    const isMintSuccessful: any = await mintHashtags(body)

    if (isMintSuccessful) {
        const searchParams = new URLSearchParams({
            title: 'Mint Successful',
            description: untrustedData.inputText,
        })

        return new NextResponse(
            `<!DOCTYPE html><html><head>
            <meta property="og:image" content="${process.env.NEXT_PUBLIC_SITE_URL}/og?${searchParams}" />
            <meta property="fc:frame" content="vNext" />
            <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_SITE_URL}/og?${searchParams}" />
            <meta property="fc:frame:button:1" content="View Transaction" />
            <meta property="fc:frame:button:1:action" content="link" />
            <meta property="fc:frame:button:1:target" content="https://sepolia.basescan.org/tx/${isMintSuccessful.hash}" />
            <meta property="fc:frame:button:2" content="Mint again ?" />
            <meta property="fc:frame:button:2:action" content="post" />
            <meta property="fc:frame:button:2:target" content="${process.env.NEXT_PUBLIC_SITE_URL}/advanced" />
        </head></html>`
        )
    }
    else {
        const searchParams = new URLSearchParams({
            title: 'Error while minting nft!',
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
                postUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/api/mint`,
            })
        )
    }
}

export async function POST(req: NextRequest): Promise<Response> {
    return getResponse(req)
}

export const dynamic = 'force-dynamic'