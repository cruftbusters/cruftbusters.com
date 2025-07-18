export function Planning() {
  return (
    <div>
      My plan is to extend Logbook to handle my accounting workflows. This could
      include small deliverable steps like:
      <ul>
        <li className="strike">
          support for multiple currencies and resource types (prefix)
        </li>
        <li className="strike">multiple named books</li>
        <li>smart editor</li>
        <li>
          suffix resource types (for example: kilowatt hours, assets like Google
          Pixel 9)
        </li>
        <li>balance sheet group account rollup</li>
        <li>local persistence and create delete rename books</li>
        <li>filter balance sheet by start date, end date, and account(s)</li>
        <li>
          balance sheet querier (input for example: "assets - liabilities"
          calculates assets less liability)
        </li>
        <li>
          balance timeseries (like every day, week, month, quarter, or year)
        </li>
        <li>bar graph for flow over time</li>
        <li>line graph for balance over time</li>
        <li>sankey for balance</li>
        <li>sync with a self-hosted server</li>
        <li>statement checking</li>
      </ul>
    </div>
  )
}
