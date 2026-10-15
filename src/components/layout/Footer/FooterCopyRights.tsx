
export function FooterCopyRights() {
    return (
        <div className="bg-background py-6 text-center">
            <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} Kurio. Propriedade digital para todos.
            </p>
        </div>
    )
}