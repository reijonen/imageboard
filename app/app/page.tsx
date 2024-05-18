import Link from "next/link";

export default function Home() {
	return (
		<>
			<div className="flex justify-center align-middle h-[100vh]">
				<div className="m-auto">
					<h1 className="text-xl font-bold">Welcome, Traveler!</h1>
					<p>This is an experimental imageboard created as a quick side project just for fun.</p>
					<p>Leave your greetings for others as you pass by.</p>
					<div className="mt-4">
						<h2 className="text-lg font-bold">Boards</h2>
						<ul>
							<li><Link href="/b" className="text-blue-900">Random</Link></li>
						</ul>
					</div>
				</div>
				<Link href="https://github.com/reijonen/imageboard" target="_blank" className="absolute right-4 bottom-2 text-sm italic text-blue-900">Source Code</Link>
			</div>
		</>
	);
}
