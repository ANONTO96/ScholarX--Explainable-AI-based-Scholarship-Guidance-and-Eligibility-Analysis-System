const APPLICATIONS_KEY = "scholarx_applications";

export function getApplications() {
    try {
        const stored = localStorage.getItem(
            APPLICATIONS_KEY
        );

        if (!stored) {
            return [];
        }

        const parsed = JSON.parse(stored);

        return Array.isArray(parsed)
            ? parsed
            : [];
    } catch (error) {
        console.error(
            "Failed to load applications:",
            error
        );

        return [];
    }
}

export function saveApplications(
    applications
) {
    try {
        localStorage.setItem(
            APPLICATIONS_KEY,
            JSON.stringify(applications)
        );
    } catch (error) {
        console.error(
            "Failed to save applications:",
            error
        );
    }
}

export function addApplication(
    application
) {
    const applications =
        getApplications();

    const newApplication = {
        id: crypto.randomUUID
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random()}`,

        ...application,

        createdAt:
            new Date().toISOString(),
    };

    const updatedApplications = [
        newApplication,
        ...applications,
    ];

    saveApplications(
        updatedApplications
    );

    return updatedApplications;
}

export function removeApplication(
    id
) {
    const applications =
        getApplications();

    const updatedApplications =
        applications.filter(
            (application) =>
                application.id !== id
        );

    saveApplications(
        updatedApplications
    );

    return updatedApplications;
}