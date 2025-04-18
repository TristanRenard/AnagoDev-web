import { useI18n } from "@/locales"
import { useState } from "react"

const ContactPage = () => {
    const t = useI18n()
    const [form, setForm] = useState({
        name: "",
        email: "",
        message: "",
    })
    const handleChange = (e) => {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: value }))
    }
    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            })

            if (!res.ok) { throw new Error("Erreur lors de l'envoi") }

            setForm({ name: "", email: "", message: "" })
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div className="flex flex-col items-center justify-center flex-1 py-10 px-4">
            <div className="w-full max-w-xl space-y-8 text-center">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                    {t("Contact Us")}
                </h1>
                <p className="text-base text-gray-500">
                    {t("We'd love to hear from you!")}
                </p>

                <form onSubmit={handleSubmit} className="space-y-6 text-left mt-8">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            {t("Your name")}
                        </label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            value={form.name}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            {t("Your email")}
                        </label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            value={form.email}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                            {t("Message")}
                        </label>
                        <textarea
                            name="message"
                            id="message"
                            rows="5"
                            value={form.message}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                            required
                        />
                    </div>

                    <div className="text-center">
                        <button
                            type="submit"
                            className="inline-flex justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none"
                        >
                            {t("Send message")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ContactPage