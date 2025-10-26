"use client";

import { Round, Standing } from "@/_lib/dto/MatchSchedule";
import { createRoundRobinElimiantonMatchesApi } from "@/_lib/server/matchSchedule";
import { Button } from "@/components/ui/button";
import { Award, Calendar, Trophy, Users } from "lucide-react";
import { useCallback } from "react";
import Swal from "sweetalert2";

type Props = {
    matchSchedule: Round[]
    totalMatches: number;
    completedMatches?: number;
    standing:Array<Standing>
}


export default function GenerateRoundRobinElimination(props: Props) {
    const { matchSchedule, totalMatches, completedMatches ,standing} = props;
    

    const handleGenerateElimination = useCallback(async () => {
        try {

          
            const resp = await createRoundRobinElimiantonMatchesApi(matchSchedule);

            if(resp.success){
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: "Elimination matches generated successfully.",
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: resp.message || "Failed to generate elimination matches.",
                });
            }
        } catch (error) {
            console.log(error)
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to generate elimination matches.",
            });
        }
    },[matchSchedule])

    //return <Button onClick={() => handleGenerateElimination()}>Generate Elimination</Button>;
    
    return (
      <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
        {/* Success Header */}
        <div className="bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 px-8 py-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-4">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              🎉 Round Robin Complete!
            </h2>
            <p className="text-green-100 text-lg">
              All {totalMatches} matches have been completed. Ready to advance
              to elimination round!
            </p>
          </div>
        </div>

        {/* Action Area */}
        <div className="p-8">
          <div className="text-center max-w-2xl mx-auto">
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl border-2 border-yellow-200 p-6 mb-6">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="bg-yellow-500 p-2 rounded-lg">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Tournament Progress
                </h3>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {completedMatches}
                  </div>
                  <div className="text-sm text-gray-600">Matches Played</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {standing.length}
                  </div>
                  <div className="text-sm text-gray-600">
                    Teams Participated
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">100%</div>
                  <div className="text-sm text-gray-600">Completion</div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 border border-yellow-300">
                <p className="text-gray-700 text-sm mb-2">
                  <strong>Next Step:</strong> Generate the elimination
                  tournament to determine the ultimate champion!
                </p>
                <p className="text-gray-600 text-xs">
                  Top teams will advance to single-elimination playoff rounds.
                </p>
              </div>
            </div>

            {/* Generate Button */}
            <div className="transform hover:scale-105 transition-all duration-300">
              <Button onClick={() => handleGenerateElimination()}>
                Generate Elimination
              </Button>
              
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold text-blue-900 text-sm">
                    Elimination Format
                  </span>
                </div>
                <p className="text-blue-700 text-xs">
                  Single-elimination knockout tournament with automatic bracket
                  generation
                </p>
              </div>

              <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-purple-600" />
                  <span className="font-semibold text-purple-900 text-sm">
                    Team Advancement
                  </span>
                </div>
                <p className="text-purple-700 text-xs">
                  Teams seeded based on round-robin performance and standings
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
}