import Breadcrumb from "../components/Breadcrumb";

function Security() {

    return (

        <div className="p-8">

            <Breadcrumb
                items={[
                    { label: "Home", path: "/" },
                    { label: "Profile", path: "/profile" },
                    { label: "Security" },
                ]}
            />

            <h1 className="text-3xl font-bold">
                Security
            </h1>

        </div>

    );
}

export default Security;