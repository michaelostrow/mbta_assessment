# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
use Mix.Config

# General application configuration
config :mbta_assessment,
  ecto_repos: [MbtaAssessment.Repo],
  mbta_timeboard_url: "http://developer.mbta.com/lib/gtrtfs/Departures.csv"

# Configures the endpoint
config :mbta_assessment, MbtaAssessment.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "RUorFUpsClm8FA/KqkeRAaeZejdafJ9QdHxSZIaV15UwMPPLZ17e8l3Y+jq4QpQx",
  render_errors: [view: MbtaAssessment.ErrorView, accepts: ~w(html json)],
  pubsub: [name: MbtaAssessment.PubSub,
           adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env}.exs"
