import { ccc } from '@ckb-ccc/core'

// Change to 'testnet' when ready for public network
const NETWORK = 'devnet'

export const ckbClient = NETWORK === 'testnet'
  ? new ccc.ClientPublicTestnet()
  : new ccc.ClientPublicTestnet({
      url: 'http://localhost:28114',
    })

export const PRIVATE_KEY =
  '0x6109170b275a09ad54877b82f7d9930f88cab5717d484fb4741ae9d1dd078cd6'