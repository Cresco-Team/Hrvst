const ApplicationLogo = (props) => {
    const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

    return (
        <img 
            {...props} 
            src="/assets/hrvst.svg" 
            alt={appName} />
    );
}
export default ApplicationLogo
