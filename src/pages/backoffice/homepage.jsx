import UpdateHomepageSheet from "@/components/backoffice/UpdateHomepageSheet"
import BackofficeLayout from "@/components/layouts/BackofficeLayout"
import { useI18n } from "@/locales"
import authProps from "@/serverSideProps/authProps"

const Homepage = () => {
    const t = useI18n()

    return (
        <BackofficeLayout>
            <div className="flex-1 flex flex-col h-full relative">
                <div className="flex flex-col items-start gap-5 m-4 py-8 px-4">
                    <h1 className="text-3xl font-black">{t("Homepage")}</h1>
                    <div className="text-lg font-bold flex gap-4 w-full justify-between">
                        <UpdateHomepageSheet />
                    </div>
                </div>

            </div>
        </BackofficeLayout>
    )
}

export default Homepage

export const getServerSideProps = async (context) => {
    const { user } = await authProps(context)

    if (!user || !user.role || user.role !== "admin") {
        return {
            notFound: true,
        }
    }

    return {
        props: {
            user,
        },
    }
}
