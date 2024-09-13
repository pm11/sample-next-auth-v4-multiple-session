import { useSession } from 'next-auth/react'
import { signIn, signOut } from 'next-auth/react'

export default function SessionPage() {
  const session = useSession()
  return (
    <div className="flex flex-col items-center justify-center pt-20 gap-2">
      <div className="rounded-lg bg-slate-300 w-[800px] h-[800px] text-lg">
        session
        <pre>
          {session.status === 'loading'
            ? 'Loading session...'
            : JSON.stringify(session.data, null, 2)}
        </pre>
      </div>
      <button
        onClick={async () => {
          await signIn('credentials', {
            email: 'test1@example.com',
            password: 'password',
            teamId: 'team1',
          })
        }}
      >
        SignIn (team1)
      </button>
      <button
        onClick={async () => {
          await signIn('credentials', {
            email: 'test2@example.com',
            password: 'password',
            teamId: 'team2',
          })
        }}
      >
        SignIn (team2)
      </button>
      <button
        onClick={async () => {
          await signIn('credentials', {
            email: 'test3@example.com',
            password: 'password',
            teamId: 'team3',
          })
        }}
      >
        SignIn (team3)
      </button>
      <button
        onClick={async () => {
          await signIn('credentials', {
            email: 'test4@example.com',
            password: 'password',
            teamId: 'team4',
          })
        }}
      >
        SignIn (team4)
      </button>
      <button onClick={() => signOut()}>SignOut</button>
    </div>
  )
}
