import { useEffect, useState } from "react";

interface LeaveStatusTimelineProps {
  request_id: number;
}

const LeaveStatusTimeline: React.FC<LeaveStatusTimelineProps> = ({
  request_id,
}) => {
  useEffect(() => {
    const token = localStorage.getItem("token")!;
    statusShow(token, request_id);
  });

  const [statusList, setStatusList] = useState<any[]>([]);

  //date format converter
  const formatDate = (isoDate: string): string => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  const statusShow = async (token: string, request_id: number) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/leave-request-status-timeline/${request_id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
      
        }
      );
      const result = await response.json();
      setStatusList(result.result);
    } catch (err) {
      console.error(err);
    }
  };
  console.log(statusList);
  return (
    <div className="h-fit flex flex-col gap-5">
      {statusList.map((data, index) => {
        if (data.approver_type === "Manager") {
          if (data.approval_status === 1) {
            return (
              <div className="flex" key={index}>
                <i className="fa-solid fa-circle-check text-green-400 text-[25px]"></i>
                <div className="flex justify-between w-full px-4 items-center">
                  <h1 className="text-[17px]">{`${data.approver_type} Approved`}</h1>
                  <p className="font-thin text-[15px]">
                    {formatDate(data.approved_at)}
                  </p>
                </div>
              </div>
            );
          } else if (data.approval_status === 0) {
            return (
              <div className="flex" key={index}>
                <i className="fa-solid fa-circle-user text-[25px] text-[#6a77f9]"></i>
                <div className="flex justify-between w-full px-4 items-center">
                  <h1 className="text-[17px]">{`${data.approver_type} Pending`}</h1>
                  <p className="font-thin text-[15px]">
                    {formatDate(data.approved_at)}
                  </p>
                </div>
              </div>
            );
          } else if (data.approval_status === 7) {
            return (
              <div>
                <div className="flex" key={index}>
                  <i className="fa-solid fa-ban text-[25px] text-red-500"></i>
                  <div className="flex justify-between w-full px-4 items-center">
                    <h1 className="text-[17px]">{`${data.approver_type} Rejected`}</h1>
                    <p className="font-thin text-[15px]">
                      {formatDate(data.approved_at)}
                    </p>
                  </div>
                </div>
                <div className="flex justify-evenly items-center w-fit gap-3 max-w-full px-2">
                  <i className="fa-solid fa-envelope text-red-400 text-[19px] cursor-pointer"></i>
                  {data.comments ? (
                    <h1 className="text-[17px] break-words whitespace-normal max-w-xs">
                      {data.comments}
                    </h1>
                  ) : (
                    <h1 className="text-[17px] break-words whitespace-normal max-w-xs">
                      No comment
                    </h1>
                  )}
                </div>
              </div>
            );
          }
        } else if (data.approver_type === "HR") {
          if (data.approval_status === 1) {
            return (
              <div className="flex" key={index}>
                <i className="fa-solid fa-circle-user text-[25px] text-[#6a77f9]"></i>
                <div className="flex justify-between w-full px-4 items-center">
                  <h1 className="text-[17px]">{`${data.approver_type} Pending`}</h1>
                  <p className="font-thin text-[15px]">
                    {formatDate(data.approved_at)}
                  </p>
                </div>
              </div>
            );
          } else if (data.approval_status === 7) {
            return (
              <div>
                <div className="flex" key={index}>
                  <i className="fa-solid fa-ban text-[25px] text-red-500"></i>
                  <div className="flex justify-between w-full px-4 items-center">
                    <h1 className="text-[17px]">{`${data.approver_type} Rejected`}</h1>
                    <p className="font-thin text-[15px]">
                      {formatDate(data.approved_at)}
                    </p>
                  </div>
                </div>
                <div className="flex justify-evenly items-center w-fit gap-3 max-w-full px-2">
                  <i className="fa-solid fa-envelope text-red-400 text-[19px] cursor-pointer"></i>
                  {data.comments ? (
                    <h1 className="text-[17px] break-words whitespace-normal max-w-xs">
                      {data.comments}
                    </h1>
                  ) : (
                    <h1 className="text-[17px] break-words whitespace-normal max-w-xs">
                      No comment
                    </h1>
                  )}
                </div>
              </div>
            );
          } else {
            const approvedAt = formatDate(data.approved_at);

            const baseBlock = (
              <div className="flex" key={index}>
                <i className="fa-solid fa-circle-check text-green-400 text-[25px]"></i>
                <div className="flex justify-between w-full px-4 items-center">
                  <h1 className="text-[17px]">{`${data.approver_type} Approved`}</h1>
                  <p className="font-thin text-[15px]">{approvedAt}</p>
                </div>
              </div>
            );

            const leaveApprovedBlock =
              data.approval_status !== 2 ? (
                <div className="flex" key={`${index}-leave`}>
                  <i className="fa-solid fa-circle-check text-green-400 text-[25px]"></i>
                  <div className="flex justify-between w-full px-4 items-center">
                    <h1 className="text-[17px]">Leave Approved</h1>
                    <p className="font-thin text-[15px]">{approvedAt}</p>
                  </div>
                </div>
              ) : null;

            return (
              <>
                {baseBlock}
                {leaveApprovedBlock}
              </>
            );
          }
        } else if (data.approver_type === "Director") {
          if (data.approval_status === 1) {
            return (
              <div className="flex" key={index}>
                <i className="fa-solid fa-circle-user text-[25px] text-[#6a77f9]"></i>
                <div className="flex justify-between w-full px-4 items-center">
                  <h1 className="text-[17px]">{`${data.approver_type} Pending`}</h1>
                  <p className="font-thin text-[15px]">
                    {formatDate(data.approved_at)}
                  </p>
                </div>
              </div>
            );
          } else if (data.approval_status === 7) {
            return (
              <div>
                <div className="flex" key={index}>
                  <i className="fa-solid fa-ban text-[25px] text-red-500"></i>
                  <div className="flex justify-between w-full px-4 items-center">
                    <h1 className="text-[17px]">{`${data.approver_type} Rejected`}</h1>
                    <p className="font-thin text-[15px]">
                      {formatDate(data.approved_at)}
                    </p>
                  </div>
                </div>
                <div className="flex justify-evenly items-center w-fit gap-3 max-w-full px-2">
                  <i className="fa-solid fa-envelope text-red-400 text-[19px] cursor-pointer"></i>
                  {data.comments ? (
                    <h1 className="text-[17px] break-words whitespace-normal max-w-xs">
                      {data.comments}
                    </h1>
                  ) : (
                    <h1 className="text-[17px] break-words whitespace-normal max-w-xs">
                      No comment
                    </h1>
                  )}
                </div>
              </div>
            );
          } else {
            const approvedAt = formatDate(data.approved_at);

            const baseBlock = (
              <div className="flex" key={index}>
                <i className="fa-solid fa-circle-check text-green-400 text-[25px]"></i>
                <div className="flex justify-between w-full px-4 items-center">
                  <h1 className="text-[17px]">{`${data.approver_type} Approved`}</h1>
                  <p className="font-thin text-[15px]">{approvedAt}</p>
                </div>
              </div>
            );

            const leaveApprovedBlock =
              data.approval_status !== 2 ? (
                <div className="flex" key={`${index}-leave`}>
                  <i className="fa-solid fa-circle-check text-green-400 text-[25px]"></i>
                  <div className="flex justify-between w-full px-4 items-center">
                    <h1 className="text-[17px]">Leave Approved</h1>
                    <p className="font-thin text-[15px]">{approvedAt}</p>
                  </div>
                </div>
              ) : null;

            return (
              <>
                {baseBlock}
                {leaveApprovedBlock}
              </>
            );
          }
        }

        return null;
      })}
    </div>
  );
};

export default LeaveStatusTimeline;
