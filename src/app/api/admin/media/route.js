import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    
    // Ensure directory exists
    try {
      await fs.access(uploadDir);
    } catch {
      await fs.mkdir(uploadDir, { recursive: true });
    }

    const files = await fs.readdir(uploadDir);
    const media = files
      .filter(file => /\.(jpg|jpeg|png|gif|svg|webp)$/i.test(file))
      .map(file => ({
        name: file,
        url: `/uploads/${file}`,
      }));

    return NextResponse.json(media);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
