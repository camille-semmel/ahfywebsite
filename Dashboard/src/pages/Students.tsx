import { useState, useMemo } from "react";
import { Plus, ExternalLink, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useStudents } from "@/hooks/useStudents";
import { PersonalizedLinkDialog } from "@/components/students/PersonalizedLinkDialog";
import { Skeleton } from "@/components/ui/skeleton";

type AgeRange = "10-12" | "13-18" | "19-25" | "26-35" | "36-50" | "50+";
type Gender  =  "male"| "female" | "other" | "prefer-not-to-say";
type House =  "cameron" | "campbell" | "douglas" | "gordon" | "macgregor" | "stewart" | "none";
type YearLevel =  "9" | "10" | "11" | "12";
type FilterUpdate = | { key: "age";    value: AgeRange } | { key: "gender"; value: Gender }| { key: "house";  value: House } | { key: "year";   value: YearLevel };

interface FilterState {
  age:AgeRange[];
  gender: Gender[];
  house: House[];
  year: YearLevel[]
}

interface StudentFiltersProps {
  onFilterChange?: (filters: FilterState) => void;
}

const houseColors: Record<House, { bg: string; border: string; text: string; dot: string }> = {
  
  cameron: {
    bg: "bg-red-50",
    border: "border-red-300",
    text: "text-red-600",
    dot: "bg-red-500",
  },
  campbell: {
    bg: "bg-green-50",
    border: "border-green-300",
    text: "text-green-600",
    dot: "bg-green-500",
  },
  douglas: {
    bg: "bg-yellow-50",
    border: "border-yellow-300",
    text: "text-yellow-600",
    dot: "bg-yellow-400",
  },
  gordon: {
    bg: "bg-blue-50",
    border: "border-blue-300",
    text: "text-blue-600",
    dot: "bg-blue-500",
  },
  macgregor: {
    bg: "bg-blue-50",
    border: "border-blue-300",
    text: "text-blue-600",
    dot: "bg-blue-500",
  },
  stewart: {
    bg: "bg-blue-50",
    border: "border-blue-300",
    text: "text-blue-600",
    dot: "bg-blue-500",
  },
  none: { 
    bg: "bg-white",
    border: "border-gray-200", 
    text: "text-gray-500",
    dot: "bg-gray-300" },
};


const Students = () => {
  const [filters, setFilters] = useState<FilterState>({
    age: [],
    gender: [],
    house: [],
     year: [],
  }); 

   const [openDropdown, setOpenDropdown] = useState<"age" | "gender" | "house" | "year" | null>(null);

 
  const updateFilter = ({ key, value }: FilterUpdate) => {
  setFilters(prev => {
    const current = prev[key];
    return {
      ...prev,
      [key]: current.includes(value as never)
        ? current.filter(v => v !== value)
        : [...current, value]
    };
  });
};

const hasActiveFilters = filters.age.length > 0 || filters.gender.length > 0 || filters.house.length > 0 || filters.year.length > 0;

 
  const clearFilters = () => {
  setFilters({ age: [], gender: [], house: [] , year: []});
};

  
   const ageLabels: Record<AgeRange, string> = {
    "10-12": "10 – 12",
    "13-18": "13 – 18",
    "19-25": "19 – 25",
    "26-35": "26 – 35",
    "36-50": "36 – 50",
    "50+": "50+",
  };
  const genderLabels: Record<Gender, string> = {
    
    male: "Male",
    female: "Female",
    other: "Other",
    "prefer-not-to-say" : "Prefer not to say",
  };
  const houseLabels: Record<House, string> = {
  
  cameron:   "Cameron",
  campbell:  "Campbell",
  douglas:   "Douglas",
  gordon:    "Gordon",
  macgregor: "MacGregor",
  stewart:   "Stewart",
  none:      "No House",
};

const yearLabels: Record<YearLevel, string> = {
  
  "9": "Year 9",
  "10": "Year 10",
  "11": "Year 11",
  "12": "Year 12",
};


  const { data: students, isLoading, error } = useStudents();
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleViewLink = (studentName: string) => {
    setSelectedStudent(studentName);
    setLinkDialogOpen(true);
  };

  const ageRanges: Record<AgeRange, (a: number) => boolean> = {
        "10-12": (a) => a >= 10 && a <= 12,
        "13-18": (a) => a >= 13 && a <= 18,
        "19-25": (a) => a >= 19 && a <= 25,
        "26-35": (a) => a >= 26 && a <= 35,
        "36-50": (a) => a >= 36 && a <= 50,
        "50+":   (a) => a > 50,
      };

  // Real-time search filtering
  const filteredStudents = useMemo(() => {
  if (!students) return [];

  return students.filter((student) => {
    // Search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        (student?.email?.toLowerCase() || '').includes(query) ||
        (student?.first_name?.toLowerCase() || '').includes(query) ||
        (student?.last_name?.toLowerCase() || '').includes(query) ||
        (student?.status?.toLowerCase() || '').includes(query) ||
        (student?.last_emotion_identified?.toLowerCase() || '').includes(query) ||
        (student?.emotional_state?.toLowerCase() || '').includes(query);
      if (!matchesSearch) return false;
    }
    // Gender filter
    if (filters.gender.length > 0) {
      if (!filters.gender.includes((student?.gender?.toLowerCase() || '') as Gender)) return false;
    }

    // House filter
    if (filters.house.length > 0) {
      const studentHouse = (student?.house?.toLowerCase() || 'none') as House;
      if (!filters.house.includes(studentHouse)) return false;
    }
    // Year level filter
    if (filters.year.length > 0) {
      const year = student?.year_level ? student.year_level.toString() : null;
      if (!year || !filters.year.includes(year as YearLevel)) return false;
    }
    // Age filter
    if (filters.age.length > 0) {
      const age = student?.age;
      if (age == null) return false;
      if (!filters.age.some(range => ageRanges[range]?.(age))) return false;
    }

    return true;
  });
}, [students, searchQuery, filters]);
  if (error) {
    return (
      <div className="p-8">
        <div className="text-center text-destructive">
          Error loading students: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-full mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold text-primary">
            Demo School
          </h1>
        </div>

        {/* Search Bar */}
        <div className="space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search by name, email, status, or emotion..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          {searchQuery && (
            <p className="text-sm text-muted-foreground">
              Showing {filteredStudents?.length ?? 0} of {students?.length ?? 0} students
            </p>
          )}
        </div>
        <div className="flex items-center gap-3 flex-wrap mb-4">
      {/* Age Filter */}
      <div className="relative">
        <button
          onClick={() => setOpenDropdown(openDropdown === "age" ? null : "age")}
          className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all ${
            filters.age.length > 0
              ? "border-orange-400 bg-orange-50 text-orange-600"
              : "border-gray-300 bg-white text-gray-600 hover:border-orange-300 hover:text-orange-500"
          }`}
          style={{ fontFamily: "inherit" }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          {filters.age.length === 0 ? "All Ages" : filters.age.length === 1 ? ageLabels[filters.age[0]] : `${filters.age.length} Ages`}

          <svg
            className={`w-3.5 h-3.5 transition-transform ${openDropdown === "age" ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
 
        {openDropdown === "age" && (
          <div className="absolute top-full mt-2 left-0 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-50 min-w-[150px]">
            {(Object.keys(ageLabels) as AgeRange[]).map((option) => (
              <button
                key={option}
                onClick={() => updateFilter({ key: "age", value: option })}
                className={`w-full text-left px-4 py-2 text-sm transition-colors hover:bg-orange-50 hover:text-orange-600 ${
                  filters.age.includes(option) ? "text-orange-500 font-semibold bg-orange-50" : "text-gray-600"
                }`}
              >
                {ageLabels[option]}
              </button>
            ))}
          </div>
        )}
      </div>
 
      {/* Gender Filter */}
      <div className="relative">
        <button
          onClick={() => setOpenDropdown(openDropdown === "gender" ? null : "gender")}
          className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all ${
            filters.gender.length > 0

              ? "border-orange-400 bg-orange-50 text-orange-600"
              : "border-gray-300 bg-white text-gray-600 hover:border-orange-300 hover:text-orange-500"
          }`}
          style={{ fontFamily: "inherit" }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          {filters.gender.length === 0
            ? "All Genders"
            : filters.gender.length === 1
              ? genderLabels[filters.gender[0]]
              : `${filters.gender.length} Genders`}
          <svg
            className={`w-3.5 h-3.5 transition-transform ${openDropdown === "gender" ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
 
        {openDropdown === "gender" && (
          <div className="absolute top-full mt-2 left-0 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-50 min-w-[180px]">
            {(Object.keys(genderLabels) as Gender[]).map((option) => (
              <button
                key={option}
                onClick={() => updateFilter({ key: "gender", value: option })}
                className={`w-full text-left px-4 py-2 text-sm transition-colors hover:bg-orange-50 hover:text-orange-600 ${
                  filters.gender.includes(option)? "text-orange-500 font-semibold bg-orange-50" : "text-gray-600"
                }`}
              >
                {genderLabels[option]}
              </button>
            ))}
          </div>
        )}
      </div>
 
      {/* House Filter */}
      <div className="relative">
        <button
          onClick={() => setOpenDropdown(openDropdown === "house" ? null : "house")}
          className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all ${
            filters.house.length > 0

              ? "border-orange-400 bg-orange-50 text-orange-600"
              : "border-gray-300 bg-white text-gray-600 hover:border-orange-300 hover:text-orange-500"
          }`}
          style={{ fontFamily: "inherit" }}
        >
          
          {filters.house.length === 0 &&  (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          )}
          {filters.house.length === 0
            ? "All Houses"
            : filters.house.length === 1
              ? houseLabels[filters.house[0]]
              : `${filters.house.length} Houses`}
          <svg
            className={`w-3.5 h-3.5 transition-transform ${openDropdown === "house" ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
 
        {openDropdown === "house" && (
          <div className="absolute top-full mt-2 left-0 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-50 min-w-[160px]">
            {(Object.keys(houseLabels) as House[]).map((option) => (
              <button
                key={option}
                onClick={() => updateFilter({ key: "house", value: option })}
                className={`w-full text-left px-4 py-2 text-sm transition-colors flex items-center gap-2.5 ${
                  filters.house.includes(option)? "font-semibold" : "text-gray-600"
                } hover:bg-gray-50`}
              >
                
                <span className={filters.house.includes(option) ? "text-orange-500" : ""}>
                  {houseLabels[option]}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
 
        {/* Year Level Filter */}
        <div className="relative">
          <button
            onClick={() => setOpenDropdown(openDropdown === "year" ? null : "year")}


            className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all ${
              filters.year.length > 0
                ? "border-orange-400 bg-orange-50 text-orange-600"
                : "border-gray-300 bg-white text-gray-600 hover:border-orange-300 hover:text-orange-500"
            }`}
            style={{ fontFamily: "inherit" }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            {filters.year.length === 0
              ? "All Years"
              : filters.year.length === 1
                ? yearLabels[filters.year[0]]
                : `${filters.year.length} Years`}
            <svg
              className={`w-3.5 h-3.5 transition-transform ${openDropdown === "year" ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {openDropdown === "year" && (
            <div className="absolute top-full mt-2 left-0 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-50 min-w-[150px]">
              {(Object.keys(yearLabels) as YearLevel[]).map((option) => (
                <button
                  key={option}
                  onClick={() => updateFilter({ key: "year", value: option })}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors hover:bg-orange-50 hover:text-orange-600 ${
                    filters.year.includes(option) ? "text-orange-500 font-semibold bg-orange-50" : "text-gray-600"
                  }`}
                >
                  {yearLabels[option]}
                </button>
              ))}
            </div>
          )}
        </div>
      {/* Clear Filters */}
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm text-gray-400 hover:text-orange-500 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Clear filters
        </button>
      )}
 
      {/* Click outside to close */}
      {openDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setOpenDropdown(null)}
        />
      )}
    </div>
        {/* Students Table */}
        <div className="bg-card rounded-card border border-border shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Student Email</TableHead>
                <TableHead className="font-semibold">Student Name</TableHead>
                <TableHead className="font-semibold">Student Last Name</TableHead>
                <TableHead className="font-semibold">Age</TableHead>
                <TableHead className="font-semibold">Gender</TableHead>
                <TableHead className="font-semibold">House</TableHead>
                <TableHead className="font-semibold">Year Level</TableHead>
                <TableHead className="font-semibold">
                  Status: Invited/Downloaded
                </TableHead>
                <TableHead className="font-semibold">Last Emotion Identified</TableHead>
                <TableHead className="font-semibold">Emotional State</TableHead>
                <TableHead className="font-semibold">Total Exercise Done</TableHead>
                <TableHead className="font-semibold">
                  Improvement Questionnaire
                </TableHead>
                <TableHead className="font-semibold">Personalized Link</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // Loading skeletons
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 9 }).map((_, j) => (
                      <TableCell key={j}>
                        <Skeleton className="h-6 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : filteredStudents?.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={13}
                    className="text-center text-muted-foreground py-12"
                  >
                    {searchQuery ? "No results match your search." : "No students found."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredStudents?.map((student) => (
                  <TableRow key={student?.user_id} className="hover:bg-muted/30">
                    <TableCell className="font-medium">{student?.email ?? 'Not Available'}</TableCell>
                    <TableCell>{student?.first_name ?? 'Not Available'}</TableCell>
                    <TableCell>{student?.last_name ?? 'Not Available'}</TableCell>
                    <TableCell>{student?.age ?? 'Not Available'}</TableCell>
                    <TableCell>{student?.gender ?? 'Not Available'}</TableCell>
                    <TableCell>{student?.house ?? 'None'}</TableCell>
                    <TableCell>{student?.year_level ?? 'Not Available'}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          student?.status === "downloaded"
                            ? "bg-primary/10 text-primary"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {student?.status ?? 'invited'}
                      </span>
                    </TableCell>
                    <TableCell>{student?.last_emotion_identified ?? 'Not Available'}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          student?.emotional_state === "critical"
                            ? "bg-destructive/10 text-destructive"
                            : student?.emotional_state === "moderate"
                              ? "bg-yellow-500/10 text-yellow-700"
                              : "bg-green-500/10 text-green-700"
                        }`}
                      >
                        {student?.emotional_state ?? 'good'}
                      </span>
                    </TableCell>
                    <TableCell>{student?.total_exercises_done ?? 0}</TableCell>
                    <TableCell>{student?.improvement_questionnaire ?? 'Pending'}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleViewLink(`${student?.first_name ?? 'Student'} ${student?.last_name ?? ''}`)
                        }
                        className="text-primary hover:text-primary/80"
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        View Link
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Personalized Link Dialog */}
        <PersonalizedLinkDialog
          open={linkDialogOpen}
          onOpenChange={setLinkDialogOpen}
          studentName={selectedStudent}
        />
      </div>
    </div>
  );
};

export default Students;
