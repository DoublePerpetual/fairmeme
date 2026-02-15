import { IS_TEST } from '@/constants/env';
import { useMemoizedFn, useSafeState } from 'ahooks';
import { pinata } from '@/utils/pinata';

interface UploadResult {
    jsonCid?: string;
    fileCid?: string;
    errorMessage?: string;
}

export interface Metadata extends Record<string, unknown> {
    name: string;
    symbol: string;
    description: string;
    twitter?: string;
    telegram?: string;
    website?: string;
    farcaster?: string;
}

interface IpfsUploadHook {
    uploadMetadataToIpfs: (file: File, metadata: Metadata) => Promise<UploadResult>;
    uploadFileToIpfs: (file: File) => Promise<UploadResult>;
    isUploading: boolean;
    uploadResult: UploadResult | null;
    error: string | null;
    resetState: () => void;
}

export const useIpfsUpload = (): IpfsUploadHook => {
    const [isUploading, setIsUploading] = useSafeState<boolean>(false);
    const [uploadResult, setUploadResult] = useSafeState<UploadResult | null>(null);
    const [error, setError] = useSafeState<string | null>(null);

    const uploadMetadataToIpfs = useMemoizedFn(async (file: File, metadata: Metadata): Promise<UploadResult> => {
        const keyRequest = await fetch('/api/key');
        const keyData = await keyRequest.json();
        const uploadImage = await pinata.upload.file(file).key(keyData.JWT);
        const image = await pinata.gateways.convert(uploadImage.IpfsHash);

        setIsUploading(true);
        setError(null);

        try {
            const jsonData: Record<string, unknown> = {
                ...metadata,
                createdOn: IS_TEST ? 'https://test.crazy.meme' : 'https://crazy.meme',
                image,
            };
            const upload = await pinata.upload.json(jsonData).key(keyData.JWT);
            const jsonCid = await pinata.gateways.convert(upload.IpfsHash);

            const result: UploadResult = {
                jsonCid,
            };

            setUploadResult(result);
            return result;
        } catch (err) {
            console.error('Error uploading metadata to IPFS:', err);
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
            setError(errorMessage);
            resetState();
            return { errorMessage };
        } finally {
            setIsUploading(false);
        }
    });

    const uploadFileToIpfs = useMemoizedFn(async (file: File): Promise<UploadResult> => {
        const keyRequest = await fetch('/api/key');
        const keyData = await keyRequest.json();

        setIsUploading(true);
        setError(null);

        try {
            const uploadFile = await pinata.upload.file(file).key(keyData.JWT);
            const fileCid = await pinata.gateways.convert(uploadFile.IpfsHash);

            const result: UploadResult = {
                fileCid,
            };

            setUploadResult(result);
            return result;
        } catch (err) {
            console.error('Error uploading file to IPFS:', err);
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
            setError(errorMessage);
            resetState();
            return { errorMessage };
        } finally {
            setIsUploading(false);
        }
    });

    const resetState = useMemoizedFn(() => {
        setIsUploading(false);
        setUploadResult(null);
        setError(null);
    });

    return {
        uploadMetadataToIpfs,
        uploadFileToIpfs,
        isUploading,
        uploadResult,
        error,
        resetState,
    };
};
