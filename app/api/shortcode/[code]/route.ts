import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(
  request: Request,
  context: { params: Promise<{ code: string }> }
) {
  const { code } = await context.params

  const { data } = await supabase
    .from("etablissements")
    .select("id")
    .eq("code_court", code.toUpperCase())
    .single()

  if (data) {
    return NextResponse.json({ id: data.id })
  } else {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }
}