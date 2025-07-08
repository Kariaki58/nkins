import Link from 'next/link';

export default function Logo() {
  return (
    <Link href="/" className="inline-block">
      <span className="text-3xl font-extrabold italic tracking-tight font-headline text-primary transition-all duration-300 hover:scale-105 hover:text-red-600">
        Nkins<span className="text-muted-foreground">.</span>
      </span>
    </Link>
  );
}
