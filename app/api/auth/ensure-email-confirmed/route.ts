import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

interface EnsureEmailConfirmedBody {
    email?: string
}

export async function POST(request: Request) {
    let body: EnsureEmailConfirmedBody
    try {
        body = await request.json()
    } catch {
        return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
    }

    const email = body.email?.trim().toLowerCase()
    if (!email) {
        return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const adminClient = createAdminClient()
    if (!adminClient) {
        return NextResponse.json({ error: "Auth service is not fully configured" }, { status: 500 })
    }

    let page = 1
    let user = null

    while (page) {
        const { data, error } = await adminClient.auth.admin.listUsers({
            page,
            perPage: 200,
        })

        if (error) {
            return NextResponse.json({ error: error.message }, { status: error.status ?? 500 })
        }

        user = data.users.find((candidate) => candidate.email?.toLowerCase() === email) ?? null

        if (user) {
            break
        }

        page = data.nextPage ?? 0
    }

    if (!user) {
        return NextResponse.json({ error: "Account not found" }, { status: 404 })
    }

    if (!user.email_confirmed_at) {
        const { error: updateError } = await adminClient.auth.admin.updateUserById(user.id, {
            email_confirm: true,
        })

        if (updateError) {
            return NextResponse.json({ error: updateError.message }, { status: 500 })
        }
    }

    return NextResponse.json({ status: "ok" })
}
