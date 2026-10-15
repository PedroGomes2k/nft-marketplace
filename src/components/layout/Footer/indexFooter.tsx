

import { FooterCopyRights } from "./FooterCopyRights";
import { FooterFeatures } from "./FooterFeatures";
import { FooterLink } from "./FooterLink";
import { FooterContact } from "./FooterContatc";


export function Footer() {
    return (
        <footer className="border-t bg-card text-card-foreground">

            <FooterFeatures />
            <FooterContact />
            <FooterLink />           
            <FooterCopyRights />
        </footer>
    )

}