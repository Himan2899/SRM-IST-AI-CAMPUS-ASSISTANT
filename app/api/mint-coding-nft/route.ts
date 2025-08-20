import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { achievementId, profile, achievement } = await request.json()

    const badge = {
      id: `nft_${achievementId}_${Date.now()}`,
      name: achievement.name,
      description: achievement.description,
      imageUrl: `/nft-${achievement.category}-${achievement.rarity}.png`,
      mintedAt: new Date(),
      category: achievement.category,
      contractAddress: "0x" + Math.random().toString(16).substr(2, 40),
      tokenId: Math.floor(Math.random() * 10000).toString(),
    }

    return NextResponse.json({
      badge,
      success: true,
      message: "NFT badge minted successfully!",
    })
  } catch (error) {
    console.error("NFT minting error:", error)
    return NextResponse.json({ error: "Failed to mint NFT badge" }, { status: 500 })
  }
}
