import Dashboard from "../assets/components/dashboard";

export default function errPage() {
    return (
        <>
        <Dashboard/>
        <div>
            <h1 className="font-bold text-white m-5"> 404 </h1>
            <p className="text-white">The Content you requested is not available</p>
        </div>
        </>
    )
}