import React from 'react';
import { usePage } from '@inertiajs/react';

export default function Navigation() {
  const { auth } = usePage().props;

  return (
    <nav>
      <div>
        <div>{/* Logo Here */}</div>
        <h3>Hrvst</h3>
      </div>

      <div>
      {!auth.user ? (
        <>
          <Link href="/login">Login</Link>
          <Link href="/register">Signup</Link>
        </>
      ) : (
          <Link href="/logout" method="post" as="button">
              Sign Out
          </Link>
      )}
      </div>
    </nav>
  );
}