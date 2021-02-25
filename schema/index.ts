import { makeSchema } from 'nexus'
import * as QueryTypes from './Query'
import path from 'path'

const schema = makeSchema({
  types: [QueryTypes],
  outputs: {
    typegen: path.join(process.cwd(),'schema', 'generated', 'nexus-typegen.ts'),
    schema: path.join(process.cwd(),'schema', 'generated', 'schema.graphql'),
  },
})

export default schema