import { Environment, quarksToKin } from '@kin-sdk-next/base'
import { Kin } from './kin'
import { sleep } from './utils'

export async function main(): Promise<number> {
  // Set up Kin client
  const kin = new Kin(Environment.Test)

  // Prepare tokens for Alice and Bob
  const privateKeyAlice = Kin.generateKey()
  const tokenAccountsAlice = await kin.createAccount(privateKeyAlice)

  console.log(`🔑 Public Key Alice    ${privateKeyAlice.publicKey().toBase58()}`)
  for (const tokenAccount of tokenAccountsAlice) {
    console.log(`🗝  Token Account Alice ${tokenAccount.toBase58()}`)
  }

  const privateKeyBob = Kin.generateKey()
  const tokenAccountsBob = await kin.createAccount(privateKeyBob)

  console.log(`🔑 Public Key Bob      ${privateKeyBob.publicKey().toBase58()}`)
  for (const tokenAccount of tokenAccountsBob) {
    console.log(`🗝  Token Account Bob   ${tokenAccount.toBase58()}`)
  }

  // Helper method to sleep a bit, then print balance of Alice and Bob
  async function sleepAndPrintBalances() {
    console.log('😴 Sleeping for a bit...')
    await sleep(5)
    await kin.getBalance(privateKeyAlice.publicKey()).then((b) => {
      console.log(`👛 Balance for Alice:  ${quarksToKin(b)} Kin`)
    })
    await kin.getBalance(privateKeyBob.publicKey()).then((b) => {
      console.log(`👛 Balance for Bob:    ${quarksToKin(b)} Kin`)
    })
  }

  await sleepAndPrintBalances()

  console.log('🙏 Request Airdrop for Alice')
  await kin.requestAirdrop(tokenAccountsAlice[0], '10')

  console.log('🙏 Request Airdrop for Bob')
  await kin.requestAirdrop(tokenAccountsBob[0], '10')

  await sleepAndPrintBalances()

  console.log('💸 Submit P2P Payment from Alice to Bob')
  await kin.submitP2P(privateKeyAlice, privateKeyBob.publicKey(), '2', 'My demo payment')

  await sleepAndPrintBalances()

  console.log('✅ Done!')
  return 0
}
