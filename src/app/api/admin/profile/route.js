import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getUserByUsername, updateUserPassword } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function POST(request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { currentPassword, newPassword } = await request.json();

    const user = getUserByUsername(session.username);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const passwordMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!passwordMatch) {
      return NextResponse.json({ error: 'Текущий пароль неверен' }, { status: 401 });
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    updateUserPassword(user.id, newHash);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
