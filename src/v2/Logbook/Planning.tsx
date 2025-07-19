export function Planning() {
  return (
    <>
      <p>
        My plan is to extend Logbook to handle my accounting workflows. This
        could include small deliverable steps like:
      </p>
      <p>
        <ul>
          <li className="strike">
            support for multiple currencies and resource types (prefix)
          </li>
          <li className="strike">multiple named books</li>
          <li className="strike">
            suffix resource types (for example: kilowatt hours, assets like
            Google Pixel 9)
          </li>
          <li>smart editor</li>
          <li>balance sheet group account rollup</li>
          <li>local persistence and create delete rename books</li>
          <li>multiple named pages per logbook</li>
          <li>
            filter input by start date, end date, account(s), logbook(s),
            page(s), prefix, and suffix
          </li>
          <li>filter "not" operator</li>
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
          <li>sync between multiple browsers/devices</li>
          <li>statement checking</li>
          <li>attach invoice to a transfer or group of transfers</li>
        </ul>
      </p>
    </>
  )
}
