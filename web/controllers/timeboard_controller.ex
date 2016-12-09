defmodule MbtaAssessment.TimeboardController do

  use MbtaAssessment.Web, :controller

  def index(conn, _params) do
    response = HTTPotion.get Application.fetch_env!(:mbta_assessment, :mbta_timeboard_url)

    # display an error if the request fails
    if !HTTPotion.Response.success?(response) do
      conn |> send_resp(500, '')
    end

    timeboard = get_json_timeboard(response.body)

    conn |> send_resp(200, timeboard)
  end

  # do some parsing on the CSV data returned so it can be returned to the frontend as JSON
  def get_json_timeboard(raw_timeboard) do
    timeboard_entries = String.split(raw_timeboard, "\n")
    timeboard_entries = List.delete_at(timeboard_entries, -1)

    timeboard_keys = Enum.map(String.split(hd(timeboard_entries), ","), fn key -> String.trim(String.downcase(key)) end)

    timeboard_values = Enum.map(tl(timeboard_entries), fn value -> String.split(value, ",") end)

    timeboard_values = Enum.map(timeboard_values, fn(value) ->
      Enum.zip(timeboard_keys, value) |> Enum.into(%{})
    end)

    Poison.encode!(timeboard_values)
  end
end
