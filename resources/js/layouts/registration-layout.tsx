

const RegistrationLayout = ({ children }) => {
    return (
        <div className="bg-muted min-h-svh flex flex-col items-center justify-center gap-6 p-10">
            <header>
                <a
                    href={route('home')}
                    className="self-center font-medium"    
                >
                    Hrvst.inc
                </a>
            </header>
            
            <main className="w-full max-w-sm">
                { children }
            </main>

            <footer>

            </footer>
        </div>
    )
}
export default RegistrationLayout