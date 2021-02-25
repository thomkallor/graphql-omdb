import { request, gql } from 'graphql-request'
export async function getServerSideProps() {
  const query = gql`
    {
      frameworks {
        id
        name
      }
    }
  `
  const data = await request('http://localhost:3000/api/graphql', query)
  const { frameworks } = data
  return {
    props: {
      frameworks,
    },
  }
}
export default function Home({ frameworks }:any) {
  return (
    <div>
      <ul>
        {frameworks.map((f:any) => (
          <li key={f.id}>{f.name}</li>
        ))}
      </ul>
    </div>
  )
}