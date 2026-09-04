const FAVORITES_KEY = "scholarx_favorites";

export function getFavorites() {
    try {
        const stored = localStorage.getItem(
            FAVORITES_KEY
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
            "Failed to load favorites:",
            error
        );

        return [];
    }
}

export function isFavorite(id) {
    return getFavorites().includes(id);
}

export function toggleFavorite(id) {
    const currentFavorites =
        getFavorites();

    const exists =
        currentFavorites.includes(id);

    const updatedFavorites = exists
        ? currentFavorites.filter(
              (favoriteId) =>
                  favoriteId !== id
          )
        : [
              ...currentFavorites,
              id,
          ];

    localStorage.setItem(
        FAVORITES_KEY,
        JSON.stringify(
            updatedFavorites
        )
    );

    return updatedFavorites;
}

export function removeFavorite(id) {
    const updatedFavorites =
        getFavorites().filter(
            (favoriteId) =>
                favoriteId !== id
        );

    localStorage.setItem(
        FAVORITES_KEY,
        JSON.stringify(
            updatedFavorites
        )
    );

    return updatedFavorites;
}