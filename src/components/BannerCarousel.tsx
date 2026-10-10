import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

interface IBanner {
  id: number;
  title: string | null;
  image_url: string;
  link_type: string;
  link_value: string | null;
  display_order: number;
}

const BannerCarousel = () => {
  const [banners, setBanners] = useState<IBanner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchActiveBanners = async () => {
      const { data, error } = await supabase
        .from("banners")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (error) {
        console.log("CAROUSEL FETCH ERROR:", error);
      } else {
        setBanners(data || []);
      }
      setLoading(false);
    };

    fetchActiveBanners();
  }, []);

  // ৪ সেকেন্ড পর পর অটো স্লাইড
  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === banners.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [banners]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  };

  const handleBannerClick = (banner: IBanner) => {
    if (!banner.link_type || banner.link_type === "shop") {
      navigate("/shop");
    } else if (banner.link_type === "category" && banner.link_value) {
      navigate(`/shop?category=${encodeURIComponent(banner.link_value)}`);
    } else if (banner.link_type === "product" && banner.link_value) {
      navigate(`/product/${banner.link_value}`);
    } else if (banner.link_type === "custom" && banner.link_value) {
      navigate(banner.link_value);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const distance = touchStart - touchEnd;

    if (Math.abs(distance) > 50) {
      if (distance > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    setTouchStart(null);
  };

  if (loading) {
    return (
      <div className="h-[350px] w-full animate-pulse rounded-3xl bg-[#1A312C]/10 md:h-[520px]" />
    );
  }

  // ব্যানার না থাকলে একটি সুন্দরPlaceholder বাটনসহ দেখাবে যেন খালি না লাগে
  if (banners.length === 0) {
    return (
      <div className="flex h-[300px] w-full flex-col items-center justify-center rounded-3xl bg-[#1A312C] p-6 text-center text-white md:h-[450px]">
        <span className="rounded-full bg-[#89D7B7] px-4 py-1 text-xs font-bold text-[#1A312C]">
          TEAL SPECIAL
        </span>
        <h2 className="mt-4 text-3xl font-extrabold md:text-5xl">
          New Collection Arrival
        </h2>
        <p className="mt-2 text-[#89D7B7] text-sm md:text-base">
          Upload active banners from Admin Dashboard to replace this space.
        </p>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-3xl shadow-2xl transition-all">
      <div
        className="relative h-[320px] w-full cursor-pointer sm:h-[420px] md:h-[520px] lg:h-[580px]"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={() => handleBannerClick(banners[currentIndex])}
      >
        <img
          src={banners[currentIndex].image_url}
          alt={banners[currentIndex].title || "TEAL Banner"}
          className="h-full w-full object-cover transition-all duration-700 ease-in-out"
        />

        {banners[currentIndex].title && (
          <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-black/20 to-transparent p-6 sm:p-10 md:p-14">
            <h2 className="text-2xl font-extrabold text-white sm:text-4xl md:text-5xl drop-shadow-md">
              {banners[currentIndex].title}
            </h2>
          </div>
        )}
      </div>

      {/* Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevSlide();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-3 text-[#1A312C] shadow-lg transition hover:bg-white hover:scale-110"
          >
            ❮
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextSlide();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-3 text-[#1A312C] shadow-lg transition hover:bg-white hover:scale-110"
          >
            ❯
          </button>
        </>
      )}

      {/* Indicator Dots */}
      {banners.length > 1 && (
        <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2.5">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(index);
              }}
              className={`h-3 rounded-full transition-all duration-300 ${
                currentIndex === index
                  ? "w-9 bg-[#89D7B7]"
                  : "w-3 bg-white/60 hover:bg-white"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BannerCarousel;