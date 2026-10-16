
export function FooterContact() {
    return (
        <div className="bg-footer-band text-foreground">
            <div className="mx-auto max-w-7xl px-4 py-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <span className="font-bold">KURIO</span>
                <span>Feito para colecionadores, criadores e cultura</span>
                <a href="mailto:contato@email.com" className="hover:underline">
                    contato@email.com
                </a>
                <span>+55 11 4002 8922</span>
            </div>
        </div>
    )
} 