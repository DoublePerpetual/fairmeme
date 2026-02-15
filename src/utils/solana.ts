import { PublicKey, Keypair, SystemProgram, SYSVAR_RENT_PUBKEY } from '@solana/web3.js';
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from '@solana/spl-token';
import { crazyMemeSolanaProgramIDL } from '@/abi/crazyMemeSolanaProgram';
import { crazyMemeSolanaProgramIDLProd } from '@/abi/crazyMemeSolanaProgramProd';
import { PUBLICKEY_FOR_SOLANA_PROGRAM_ID, GLOBAL_SEED, CRAZY_STATE_SEED } from '@/constants/solana';
import { IS_TEST } from '@/constants/env';

export const programId = new PublicKey(PUBLICKEY_FOR_SOLANA_PROGRAM_ID);
const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
    IS_TEST ? 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s' : 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
);
export const getCrazyMemeSolanaProgram = (anchorProvider: AnchorProvider) =>
    new Program(
        IS_TEST ? crazyMemeSolanaProgramIDL : crazyMemeSolanaProgramIDLProd,
        programId.toBase58(),
        anchorProvider,
    );

export const getCommonAccountParams = async (publicKey: PublicKey) => {
    const mint = Keypair.generate();
    const dev = Keypair.generate();

    const devAuthority = dev.publicKey;
    const [globalPDA] = PublicKey.findProgramAddressSync([Buffer.from(GLOBAL_SEED)], programId);
    const [crazyStatePDA] = PublicKey.findProgramAddressSync(
        [Buffer.from(CRAZY_STATE_SEED), mint.publicKey.toBuffer()],
        programId,
    );
    const [metadataAddress] = PublicKey.findProgramAddressSync(
        [Buffer.from('metadata'), TOKEN_METADATA_PROGRAM_ID.toBuffer(), mint.publicKey.toBuffer()],
        TOKEN_METADATA_PROGRAM_ID,
    );
    const creatorTokenAccount = await getAssociatedTokenAddress(mint.publicKey, publicKey);
    const crazyTokenAccount = await getAssociatedTokenAddress(mint.publicKey, crazyStatePDA, true);
    const [mintAuthority] = PublicKey.findProgramAddressSync([Buffer.from('mint-authority')], programId);
    const systemProgram = SystemProgram.programId;

    return {
        mint,
        dev,
        globalPDA,
        crazyStatePDA,
        devAuthority,
        metadataAddress,
        crazyTokenAccount,
        mintAuthority,
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        TOKEN_METADATA_PROGRAM_ID,
        SYSVAR_RENT_PUBKEY,
        systemProgram,
        creatorTokenAccount,
    };
};
