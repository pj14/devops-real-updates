import React from "react";
import { Select, SelectItem, SelectSection } from "@nextui-org/react";
import { regions } from "@/utils/constants";
import { IRegionSelectorProps } from "@/types/headerTypes";

export default function RegionSelector(props: IRegionSelectorProps) {
  const { region, setRegion } = props;
  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e?.target?.value) {
      setRegion(e.target.value);
    }
  };

  return (
    <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
      <Select
        radius="sm"
        size="lg"
        className="flex items-center max-w-xs 
            [&>div>button]:min-w-[250px] [&>div>button]:bg-yellow-300 [&>div>button]:rounded-lg font-semibold"
        labelPlacement="outside-left"
        label="Region:"
        placeholder="Select a region"
        onChange={handleRegionChange}
        selectedKeys={[region]}
      >
        <SelectSection className="bg-[#3f3f3f] p-0 rounded-lg">
          {regions.map((region) => (
            <SelectItem
              className="hover:bg-purple-400 text-white"
              key={region.key}
            >
              {region.label}
            </SelectItem>
          ))}
        </SelectSection>
      </Select>
    </div>
  );
}
