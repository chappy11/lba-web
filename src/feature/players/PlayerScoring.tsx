import { Props } from "next/script";

type Props = {
    gameId: string;
    gameRecordId: string;
    isUpdate: boolean;
}

export default function PlayerScoring(props:Props) {
    
    return (
        <div>
            <p>Test</p>
        </div>
    );
}