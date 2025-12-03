import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get("url")

  if (!url) {
    return NextResponse.json({ error: "URL parameter required" }, { status: 400 })
  }

  try {
    // Get range header from client request
    const range = request.headers.get("range")

    // Build headers for upstream request
    const upstreamHeaders: HeadersInit = {}
    if (range) {
      upstreamHeaders["Range"] = range
    }

    const response = await fetch(url, {
      headers: upstreamHeaders,
    })

    if (!response.ok && response.status !== 206) {
      return NextResponse.json({ error: "Failed to fetch audio" }, { status: response.status })
    }

    const contentType = response.headers.get("Content-Type") || "audio/mpeg"
    const contentLength = response.headers.get("Content-Length")
    const acceptRanges = response.headers.get("Accept-Ranges")
    const contentRange = response.headers.get("Content-Range")

    // Stream the response body
    const body = response.body

    if (!body) {
      return NextResponse.json({ error: "Empty response body" }, { status: 500 })
    }

    // Build response headers
    const responseHeaders: HeadersInit = {
      "Content-Type": contentType,
      "Accept-Ranges": "bytes",
    }

    if (contentLength) {
      responseHeaders["Content-Length"] = contentLength
    }

    if (contentRange) {
      responseHeaders["Content-Range"] = contentRange
    }

    // Return 206 Partial Content if range was requested
    const status = range && response.status === 206 ? 206 : 200

    return new NextResponse(body, {
      status,
      headers: responseHeaders,
    })
  } catch (error) {
    console.error("Audio proxy error:", error)
    return NextResponse.json({ error: "Failed to proxy audio" }, { status: 500 })
  }
}
