import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import SearchBar from "@/components/SearchBar";

const fetchDoa = async () => {
    const res = await fetch("https://equran.id/api/doa");
    const body = await res.json();
    return body.data || [];
};

const Doa = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");

    const { data: doaList, isLoading, error } = useQuery({
        queryKey: ["doaList"],
        queryFn: fetchDoa,
    });

    // filter data
    const filteredDoa = doaList?.filter((d) => {
        const q = search.toLowerCase();
        return (
            d.nama?.toLowerCase().includes(q) ||
            d.grup?.toLowerCase().includes(q) ||
            d.idn?.toLowerCase().includes(q) ||
            d.tr?.toLowerCase().includes(q)
        );
    });

    return (
        <div className="min-h-screen bg-background px-4 py-8">

            {/* Back */}
            <Button
                variant="ghost"
                className="mb-4 flex items-center gap-2"
                onClick={() => navigate(-1)}
            >
                <ArrowLeft className="h-5 w-5" />
                Kembali
            </Button>

            <h1 className="text-3xl font-bold text-center mb-6">
                Kumpulan Doa Harian
            </h1>

            {/* Search Bar */}
            <div className="max-w-xl mx-auto mb-8">
                <SearchBar
                    value={search}
                    onChange={setSearch}
                    placeholder="Cari doa..."
                />
            </div>

            {isLoading && <p className="text-center">Memuat doa...</p>}
            {error && <p className="text-center text-destructive">Gagal memuat data</p>}

            {/* Jika hasil pencarian kosong */}
            {filteredDoa?.length === 0 && (
                <p className="text-center text-muted-foreground py-10">
                    Doa tidak ditemukan
                </p>
            )}

            <div className="space-y-6">
                {filteredDoa?.map((doa) => (
                    <div key={doa.id} className="bg-card border rounded-xl p-6 shadow">

                        <h2 className="text-xl font-semibold mb-3">{doa.nama}</h2>

                        <p className="text-right text-2xl font-arabic mb-3 leading-relaxed">
                            {doa.ar}
                        </p>

                        <p className="italic text-muted-foreground mb-2">
                            {doa.tr}
                        </p>

                        <p className="text-foreground">
                            {doa.idn}
                        </p>

                        {doa.tag?.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                                {doa.tag.map((t, i) => (
                                    <span
                                        key={i}
                                        className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-md"
                                    >
                                        #{t}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <ScrollToTopButton />
        </div>
    );
};

export default Doa;
