import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { leetcodeUsername, githubUsername } = await request.json()

    let leetcodeSolved = 0
    let githubRepos = 0

    if (leetcodeUsername) {
      try {
        const leetcodeQuery = {
          query: `
            query getUserProfile($username: String!) {
              matchedUser(username: $username) {
                username
                submitStats: submitStatsGlobal {
                  acSubmissionNum {
                    difficulty
                    count
                    submissions
                  }
                }
              }
            }
          `,
          variables: { username: leetcodeUsername },
        }

        const leetcodeResponse = await fetch("https://leetcode.com/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          },
          body: JSON.stringify(leetcodeQuery),
        })

        if (leetcodeResponse.ok) {
          const leetcodeData = await leetcodeResponse.json()
          if (leetcodeData.data?.matchedUser?.submitStats?.acSubmissionNum) {
            // Sum up all accepted submissions (Easy + Medium + Hard)
            leetcodeSolved = leetcodeData.data.matchedUser.submitStats.acSubmissionNum.reduce(
              (total: number, item: any) => total + item.count,
              0,
            )
          }
        } else {
          console.error("LeetCode API response not ok:", leetcodeResponse.status)
        }
      } catch (error) {
        console.error("LeetCode API error:", error)
        // If LeetCode API fails, return 0 instead of mock data
        leetcodeSolved = 0
      }
    }

    if (githubUsername) {
      try {
        const response = await fetch(`https://api.github.com/users/${githubUsername}/repos?per_page=100&type=owner`, {
          headers: {
            "User-Agent": "SRM-Campus-Assistant",
            Accept: "application/vnd.github.v3+json",
          },
        })

        if (response.ok) {
          const repos = await response.json()
          // Filter out forked repositories to count only original projects
          githubRepos = repos.filter((repo: any) => !repo.fork).length
        } else if (response.status === 403) {
          const rateLimitRemaining = response.headers.get("X-RateLimit-Remaining")
          const rateLimitReset = response.headers.get("X-RateLimit-Reset")

          console.error("GitHub API rate limit exceeded. Remaining:", rateLimitRemaining)

          // Return error message about rate limiting
          return NextResponse.json(
            {
              error:
                "GitHub API rate limit exceeded. Please try again later or the system administrator should add a GitHub token for higher limits.",
              rateLimitInfo: {
                remaining: rateLimitRemaining,
                resetTime: rateLimitReset ? new Date(Number.parseInt(rateLimitReset) * 1000).toISOString() : null,
              },
            },
            { status: 429 },
          )
        } else if (response.status === 404) {
          return NextResponse.json(
            {
              error: `GitHub user '${githubUsername}' not found. Please check the username and try again.`,
            },
            { status: 404 },
          )
        } else {
          console.error("GitHub API response not ok:", response.status)
          return NextResponse.json(
            {
              error: `GitHub API error: ${response.status}. Please try again later.`,
            },
            { status: response.status },
          )
        }
      } catch (error) {
        console.error("GitHub API error:", error)
        return NextResponse.json(
          {
            error: "Failed to connect to GitHub API. Please check your internet connection and try again.",
          },
          { status: 500 },
        )
      }
    }

    console.log(`[v0] Fetched real data - LeetCode: ${leetcodeSolved}, GitHub: ${githubRepos}`)

    return NextResponse.json({
      leetcodeSolved,
      githubRepos,
      success: true,
      message: `Successfully fetched ${leetcodeUsername ? "LeetCode" : ""}${leetcodeUsername && githubUsername ? " and " : ""}${githubUsername ? "GitHub" : ""} data`,
    })
  } catch (error) {
    console.error("Profile fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch profile data" }, { status: 500 })
  }
}
