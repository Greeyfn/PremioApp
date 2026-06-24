import { NextResponse } from "next/server";
import { getUsdRate } from "@/lib/currency";

/**
 * GET /api/currency
 * Returns the current USD→Toman exchange rate.
 * Response is cached for 5 minutes server-side.
 */
export async function GET() {
  try {
    const rateData = await getUsdRate();

    return NextResponse.json({
      toman: rateData.toman,
      rate: rateData.rate,
      updatedAt: rateData.updatedAt,
    }, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60",
      },
    });
  } catch (error) {
    console.error("Currency API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch exchange rate" },
      { status: 500 }
    );
  }
}
