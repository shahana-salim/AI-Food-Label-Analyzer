import Breadcrumb from "../components/Breadcrumb";

function HealthPreferences() {


    return (

        <div className="p-8">

            <Breadcrumb
                items={[
                    { label: "Home", path: "/" },
                    { label: "Profile", path: "/profile" },
                    { label: "Health Preferences" },
                ]}
            />
            
            <h1 className="text-3xl font-bold">
                Health Preferences
            </h1>

        </div>

    );
}

export default HealthPreferences;