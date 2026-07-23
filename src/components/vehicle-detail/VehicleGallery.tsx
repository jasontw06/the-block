import { useState } from "react";
import { getVehicleImages, getVehicleTitle } from "../../lib/vehicle";
import type { Vehicle } from "../../types/vehicle";
import styles from "./VehicleGallery.module.css";

type VehicleGalleryProps = {
  vehicle: Vehicle;
};

export function VehicleGallery({ vehicle }: VehicleGalleryProps) {
  const images = getVehicleImages(vehicle);
  const [activeIndex, setActiveIndex] = useState(0);
  const [brokenIndexes, setBrokenIndexes] = useState<Record<number, boolean>>(
    {},
  );

  const safeIndex = images.length === 0 ? 0 : Math.min(activeIndex, images.length - 1);
  const activeImage = images[safeIndex];
  const activeBroken = brokenIndexes[safeIndex] === true;
  const title = getVehicleTitle(vehicle);
  const trimPart = vehicle.trim?.trim() ? ` ${vehicle.trim}` : "";

  function handleImageError(index: number) {
    setBrokenIndexes((current) => {
      if (current[index]) {
        return current;
      }

      return { ...current, [index]: true };
    });
  }

  return (
    <section className={styles.gallery} aria-label="Vehicle photos">
      <div className={styles.stage}>
        {activeImage && !activeBroken ? (
          <img
            key={activeImage}
            src={activeImage}
            alt={`${title}${trimPart} – photo ${safeIndex + 1} of ${images.length}`}
            className={styles.mainImage}
            width={800}
            height={600}
          />
        ) : (
          <div className={styles.fallback} role="img" aria-label="Vehicle image unavailable">
            Vehicle image unavailable
          </div>
        )}
      </div>

      {images.length > 1 ? (
        <ul className={styles.thumbs} aria-label="Vehicle photo thumbnails">
          {images.map((image, index) => {
            const selected = index === safeIndex;
            const broken = brokenIndexes[index] === true;

            return (
              <li key={`${image}-${index}`}>
                <button
                  type="button"
                  className={styles.thumbButton}
                  onClick={() => setActiveIndex(index)}
                  aria-label={`View photo ${index + 1} of ${images.length}`}
                  aria-current={selected ? "true" : undefined}
                >
                  {broken ? (
                    <span className={styles.thumbFallback}>N/A</span>
                  ) : (
                    <img
                      src={image}
                      alt=""
                      className={styles.thumbImage}
                      loading="lazy"
                      decoding="async"
                      width={160}
                      height={120}
                      onError={() => handleImageError(index)}
                    />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </section>
  );
}
