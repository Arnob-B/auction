import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get("url");

    if (!imageUrl) {
        return NextResponse.json({ error: "URL parameter is required" }, { status: 400 });
    }

    try {
        const response = await fetch(imageUrl, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                "Referer": "https://sofifa.com/",
            },
        });

        if (!response.ok) {
            return NextResponse.json({ error: "Failed to fetch image" }, { status: response.status });
        }

        const imageBuffer = await response.arrayBuffer();
        const contentType = response.headers.get("content-type") || "image/png";

        return new NextResponse(imageBuffer, {
            headers: {
                "Content-Type": contentType,
                "Cache-Control": "public, max-age=86400", // Cache for 24 hours
            },
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to proxy image" }, { status: 500 });
    }
}
