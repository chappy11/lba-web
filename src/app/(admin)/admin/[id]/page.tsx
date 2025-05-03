import { useRouter } from "next/router";

export default function Page() {
    const router = useRouter();
    const { id } = router.query;

    return (
        <div className=" flex flex-1">
            <p>{idma }</p>
        </div>
    )
}