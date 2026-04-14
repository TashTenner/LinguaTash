// lib/nordkreis/googleAuth.ts

import { GoogleAuth, JWT } from 'google-auth-library'

export async function getSheetsToken(): Promise<string> {
  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON!)
  const auth = new GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })
  const client = (await auth.getClient()) as JWT
  const tokenResponse = await client.getAccessToken()
  if (!tokenResponse.token) throw new Error('Could not obtain Google Sheets access token')
  return tokenResponse.token
}

export async function getSheetsReadOnlyToken(): Promise<string> {
  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON!)
  const auth = new GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  })
  const client = (await auth.getClient()) as JWT
  const tokenResponse = await client.getAccessToken()
  if (!tokenResponse.token) throw new Error('Could not obtain Google Sheets read-only token')
  return tokenResponse.token
}

/**
 * Sheet tab name — controlled by NORDKREIS_SHEET_TAB env var.
 * Set this each school year: e.g. NORDKREIS_SHEET_TAB=2026-2027
 * Defaults to '2026-2027' if the var is not set.
 */
export const SHEET_NAME = process.env.NORDKREIS_SHEET_TAB ?? '2026-2027'
export const SHEET_ID = process.env.GOOGLE_SHEET_ID!
