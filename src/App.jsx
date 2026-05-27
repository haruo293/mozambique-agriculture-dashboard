import { useState } from "react";
import {
  ComposedChart, BarChart, AreaChart,
  Bar, Line, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell,
} from "recharts";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SVG MAP DATA — Natural Earth 10m, simplified 0.02°
// Canvas 300×540 | x=(lon-30)/11.2*300, y=(1-(lat+27.2)/17)*540
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const NE_PATHS = {
  maputo:"M56.6,528.6L56.4,517.8L54.6,510.9L55.8,506.6L55.5,502.2L52.2,500.6L51.0,495.9L53.5,490.3L52.7,485.4L53.4,454.2L51.6,447.1L55.6,445.1L64.0,447.2L68.1,450.5L72.5,451.2L72.9,455.8L76.1,461.5L78.7,463.2L78.4,471.3L80.3,472.5L80.5,476.7L83.3,477.3L84.1,479.1L83.9,482.2L76.9,487.4L74.8,490.4L73.5,496.1L72.4,496.3L72.0,498.3L71.2,499.0L68.4,497.6L66.3,501.4L66.7,502.3L67.0,501.0L68.2,501.2L71.0,504.8L71.8,507.9L73.6,508.0L76.1,511.1L77.1,510.7L77.5,505.5L79.1,504.4L77.5,528.8L56.6,528.6ZM77.9,503.7L78.2,501.9L79.9,500.9L79.3,503.3L78.0,502.8L77.9,503.7Z",
  cabo:"M247.5,30.9L254.4,25.1L261.4,23.6L268.1,19.4L279.6,8.7L282.0,9.2L281.4,11.6L282.9,12.2L283.3,14.3L285.2,14.9L280.9,17.9L281.0,19.0L281.6,18.1L284.5,20.4L281.1,24.0L281.4,26.6L283.0,25.9L281.2,29.8L281.4,31.4L278.5,35.3L277.2,35.5L277.9,36.8L278.1,36.2L279.6,37.9L280.3,37.6L279.2,43.3L280.1,44.6L279.3,46.1L280.7,51.6L281.8,52.1L280.9,53.8L282.2,57.1L281.2,61.2L281.9,63.7L279.9,65.5L281.6,66.7L281.5,69.3L282.9,69.5L280.7,73.1L282.9,74.0L283.0,76.6L284.5,77.7L283.1,77.8L283.3,79.6L284.2,79.5L285.2,81.2L284.7,82.4L283.1,81.9L283.3,82.7L282.1,83.0L282.7,84.1L281.9,86.1L280.8,85.2L278.9,87.1L280.8,89.6L281.6,88.9L281.3,87.3L283.6,87.6L283.1,96.7L282.0,98.4L283.1,98.0L283.5,101.1L281.4,105.5L280.0,105.1L279.1,103.4L274.6,104.4L271.3,103.2L263.8,110.4L261.5,110.2L254.9,113.2L252.6,115.8L246.6,119.2L243.2,119.1L242.2,120.9L236.8,124.1L232.6,125.4L225.5,124.7L223.6,122.6L220.0,115.2L217.3,104.3L215.7,103.6L215.5,101.8L218.2,98.9L220.0,93.7L219.8,92.5L217.9,93.4L213.6,91.4L215.4,80.1L215.1,73.0L218.9,68.7L219.9,64.0L223.2,61.1L223.6,58.4L225.7,55.3L226.2,51.3L224.9,48.4L225.1,45.9L226.3,40.5L228.1,37.6L231.8,34.2L234.6,33.8L238.3,30.7L244.5,29.8L247.5,30.9Z",
  niassa:"M217.4,33.3L218.8,34.4L221.2,34.2L223.6,36.8L227.5,38.5L225.1,45.9L224.9,48.4L226.2,51.3L225.7,55.3L223.6,58.4L223.2,61.1L219.9,64.0L218.9,68.7L215.1,73.0L215.4,80.1L214.4,89.7L213.6,91.2L217.8,93.4L219.9,92.6L219.3,96.6L215.6,101.7L215.7,103.6L217.3,104.3L220.0,115.2L223.6,122.6L225.5,124.7L221.4,125.8L218.8,128.0L214.3,129.0L212.6,130.4L210.4,128.0L207.7,129.5L204.5,129.6L203.4,132.8L200.4,133.5L196.7,138.1L193.9,139.9L192.1,139.6L184.6,145.3L179.9,152.6L179.8,154.4L177.8,157.7L175.1,160.6L170.7,162.2L168.4,168.1L166.0,166.9L156.4,167.0L154.9,157.9L158.2,148.9L157.1,148.6L156.6,141.4L136.2,111.3L130.3,105.3L124.3,104.6L121.7,99.3L120.4,79.0L116.6,63.5L117.3,60.5L122.2,51.8L123.5,47.4L123.4,44.2L124.6,43.5L145.3,43.7L148.2,44.9L151.7,43.6L152.6,41.1L156.1,38.5L159.1,39.2L159.9,41.4L165.2,43.8L166.1,47.7L174.0,47.0L175.3,48.6L177.5,48.3L180.5,46.8L182.7,43.6L185.0,44.2L188.4,43.4L191.3,46.8L196.6,47.0L199.6,48.4L209.4,42.4L210.9,35.5L217.4,33.3Z",
  tete:"M10.8,184.3L11.1,172.4L9.8,169.9L10.5,167.7L9.6,163.1L7.0,159.8L5.7,151.9L8.5,151.4L21.9,145.1L37.8,140.8L44.4,137.2L85.8,121.1L87.9,122.6L88.1,125.7L92.1,132.8L96.3,137.0L97.6,139.8L98.4,139.8L98.7,137.2L99.7,136.3L101.9,137.6L104.9,136.0L108.5,136.4L110.1,134.7L116.4,133.0L121.0,140.0L120.7,143.0L122.8,152.0L121.8,154.3L122.4,161.1L118.1,167.8L118.0,173.0L113.8,177.7L113.4,180.7L118.0,186.1L117.5,190.2L118.6,192.9L121.2,193.8L124.7,199.8L126.8,201.0L131.4,207.8L134.0,210.1L137.1,210.7L137.3,213.9L134.9,217.1L136.1,219.9L141.7,220.1L142.9,227.4L142.5,239.0L136.8,234.0L130.2,215.2L127.8,212.9L118.1,207.5L113.0,206.4L110.3,204.4L107.6,204.2L104.9,201.8L101.9,197.0L95.3,197.6L93.3,199.1L92.2,200.8L92.2,203.3L89.0,207.6L86.6,216.1L83.3,218.8L82.8,222.9L81.4,225.9L81.4,227.9L80.7,228.2L79.1,221.3L75.8,213.9L78.1,211.2L79.5,205.9L77.5,206.9L73.2,206.8L71.6,203.3L61.4,198.6L51.2,197.9L50.1,195.4L45.8,191.2L37.6,189.4L33.7,185.0L29.8,184.1L26.5,186.3L23.0,184.2L10.8,184.3Z",
  manica:"M80.0,260.9L81.5,258.9L79.2,255.9L79.7,253.6L78.4,246.9L79.1,245.9L78.9,242.5L80.3,241.2L81.0,235.7L78.7,231.8L81.4,227.9L83.3,218.8L86.6,216.1L89.0,207.6L92.2,203.3L92.2,200.8L93.3,199.1L95.3,197.6L101.9,197.0L104.9,201.8L107.6,204.2L110.3,204.4L113.0,206.4L118.1,207.5L123.1,210.6L119.8,215.5L114.9,218.0L113.1,222.3L110.6,235.3L111.4,239.6L111.1,243.5L113.6,244.6L114.7,246.3L113.7,254.2L111.7,254.6L110.1,256.2L108.4,255.0L107.1,252.5L105.6,252.1L105.1,253.9L102.2,257.0L103.7,263.3L99.5,269.4L99.8,270.6L102.9,271.7L105.7,275.6L108.0,277.1L105.2,289.3L105.1,297.8L103.0,298.8L103.9,300.7L103.8,304.2L107.2,306.2L101.3,310.0L100.4,311.4L98.0,309.2L94.4,310.9L91.3,314.0L94.0,320.2L93.5,324.6L100.2,332.5L104.1,334.2L104.4,341.9L107.4,342.4L110.5,345.9L108.6,348.0L107.6,353.0L105.8,353.4L103.9,356.2L94.5,355.8L89.1,359.0L86.2,358.5L84.1,359.4L82.2,362.0L80.0,361.1L78.6,358.7L75.3,358.5L71.9,355.8L66.7,354.0L62.7,347.3L66.7,341.0L66.5,330.4L67.3,329.2L70.9,329.0L71.6,328.2L76.4,320.0L77.3,314.6L79.1,312.3L80.6,312.3L81.2,304.4L79.4,302.9L78.8,300.2L76.9,301.5L75.5,300.9L75.9,295.4L74.0,294.3L74.2,291.1L75.8,288.6L76.5,282.2L75.4,280.3L72.3,280.2L71.8,278.1L72.7,277.0L72.1,274.3L77.7,272.4L78.3,269.8L76.9,264.8L80.3,262.6L80.0,260.9Z",
  sofala:"M165.9,271.9L161.0,277.0L160.1,277.1L159.9,276.1L158.8,278.4L156.8,278.0L157.2,279.2L151.7,283.8L151.1,285.0L151.8,285.0L143.0,296.1L137.3,301.9L130.7,307.0L129.6,306.4L129.2,304.5L126.0,302.3L123.9,298.5L122.0,298.0L121.4,299.3L123.6,299.0L125.7,303.1L128.0,305.4L127.4,307.1L126.1,307.6L127.6,308.2L127.2,312.1L127.9,316.1L127.4,317.0L124.7,316.1L127.1,318.5L125.4,322.3L125.9,323.1L124.3,323.2L126.3,326.1L125.0,328.5L127.0,327.9L129.4,330.7L130.0,332.6L131.1,332.2L130.5,333.9L132.7,333.4L133.8,334.5L134.6,336.5L134.2,338.1L135.3,339.4L134.9,341.1L136.1,340.3L136.9,341.6L130.6,343.8L127.5,347.1L125.0,346.0L119.5,348.5L116.0,352.9L113.7,351.6L111.8,353.3L107.6,353.0L108.6,348.0L110.5,345.9L107.4,342.4L104.4,341.9L104.1,334.2L100.2,332.5L93.5,324.6L94.0,320.2L91.3,314.2L95.9,309.9L98.1,309.2L100.4,311.4L101.3,310.0L107.2,306.2L103.8,304.2L103.9,300.7L103.0,298.8L105.1,297.8L105.2,289.3L108.0,277.1L105.7,275.6L103.2,272.0L99.5,269.8L99.9,268.0L103.7,263.3L102.2,257.0L105.1,253.9L105.6,252.1L107.1,252.5L108.4,255.0L110.3,256.3L111.7,254.6L113.2,254.7L114.0,253.2L114.7,246.0L111.1,243.5L111.4,239.6L110.6,235.3L113.1,222.3L114.9,218.0L119.8,215.5L123.1,210.6L127.8,212.9L130.2,215.2L137.1,234.6L143.1,239.5L148.0,247.1L156.2,251.4L157.8,255.5L163.1,259.5L164.9,266.6L163.9,267.3L163.6,270.2L164.9,270.4L165.9,271.9Z",
  zambezia:"M156.4,167.1L166.0,166.9L168.4,168.1L170.7,162.2L175.9,160.0L179.8,154.4L179.9,152.6L193.3,152.8L197.8,159.4L201.6,156.6L205.9,160.2L209.4,158.4L211.3,159.9L213.1,159.9L218.0,163.5L219.5,166.3L224.3,167.4L228.5,170.9L229.2,172.7L232.4,174.1L235.2,177.2L239.3,187.5L239.0,190.9L242.0,198.3L242.3,201.0L240.7,202.0L240.5,203.9L244.5,210.4L244.5,212.4L243.2,213.3L244.3,213.4L244.2,214.6L237.7,217.4L233.5,217.9L232.0,216.8L232.1,218.4L230.4,218.4L229.1,219.9L228.0,219.3L227.8,220.3L218.9,225.1L218.0,224.4L217.9,222.2L217.5,221.6L217.4,222.4L216.5,222.1L217.7,225.1L211.8,227.3L203.1,232.5L194.0,239.4L192.6,239.5L187.1,248.2L184.5,244.0L183.0,243.9L182.7,244.7L184.1,244.6L185.0,248.2L186.9,249.2L186.1,251.0L184.5,253.8L182.4,253.7L181.8,255.1L183.4,254.1L183.1,254.7L175.5,263.2L175.1,264.9L173.4,265.4L171.9,269.6L171.0,270.0L170.7,271.3L171.5,271.3L171.6,272.7L170.3,273.3L168.6,272.5L167.1,269.8L168.0,275.9L164.6,276.4L164.3,273.4L165.9,271.9L164.9,270.4L163.9,267.3L163.1,259.5L157.8,255.5L156.2,251.4L148.0,247.1L142.5,239.0L142.9,227.4L141.7,220.1L142.3,215.4L141.2,214.2L142.2,211.3L141.4,206.5L138.6,204.1L137.5,201.3L140.0,199.2L141.1,195.6L140.9,192.9L144.0,188.7L145.6,188.2L147.7,189.7L148.1,188.7L152.3,187.8L155.0,185.6L156.4,167.1Z",
  inhambane:"M136.9,341.6L136.8,343.0L135.7,343.6L136.0,345.8L134.6,345.8L134.4,346.6L136.2,349.8L135.2,351.1L135.9,353.3L137.3,348.7L137.1,355.0L141.2,363.5L141.1,367.6L142.9,377.7L142.1,387.2L144.5,390.3L145.4,387.7L144.4,383.5L145.0,381.4L145.6,382.5L146.0,382.0L145.0,380.5L145.8,378.6L147.3,378.2L147.8,384.7L148.7,380.5L147.0,396.7L148.3,404.9L150.2,403.9L146.7,412.2L147.0,415.3L145.3,421.9L144.4,430.3L144.2,428.1L143.0,428.1L143.8,429.7L142.8,437.2L144.3,435.6L144.1,433.4L146.4,434.5L146.7,431.4L148.1,432.1L148.5,434.0L146.9,439.5L147.1,441.9L138.8,455.2L136.8,457.3L128.9,461.9L120.0,465.4L119.2,463.9L115.8,463.3L115.2,461.3L119.6,458.1L117.3,455.2L118.5,453.0L110.9,455.5L107.2,448.9L106.9,441.1L105.1,441.1L104.9,439.6L105.4,430.7L106.1,428.7L105.5,427.5L104.3,427.4L105.8,425.5L105.8,423.9L104.2,422.2L103.0,419.0L104.7,417.7L102.9,412.8L98.7,407.6L97.1,403.3L92.3,398.8L88.6,393.3L88.9,387.4L90.4,386.4L90.3,378.3L89.2,374.8L84.6,369.2L84.3,365.0L87.8,359.1L91.2,358.1L93.5,356.1L102.4,355.6L103.3,356.4L106.2,353.1L111.8,353.3L113.7,351.6L116.0,352.9L119.5,348.5L125.0,346.0L127.5,347.1L130.6,343.8L136.9,341.6ZM145.6,367.9L147.1,359.9L147.1,363.4L145.6,367.9Z",
  gaza:"M64.5,352.3L68.6,355.3L71.9,355.8L75.3,358.5L78.6,358.7L80.0,361.1L82.2,362.0L84.1,359.4L86.2,358.5L87.8,359.1L84.3,365.4L84.6,369.2L89.2,374.8L90.3,378.3L90.4,386.4L88.9,387.4L88.4,392.5L92.3,398.8L97.1,403.3L98.7,407.6L102.9,412.8L104.7,417.7L103.0,419.0L104.2,422.2L105.8,423.9L105.8,425.5L104.3,427.4L105.5,427.5L106.1,428.7L105.4,430.7L104.9,439.6L105.1,441.1L106.9,441.1L107.2,448.9L110.9,455.5L118.5,453.0L117.3,455.2L119.6,458.1L115.1,460.9L115.8,463.3L119.2,463.9L120.0,465.4L99.9,473.5L87.8,479.5L88.9,478.1L86.1,479.6L86.8,480.0L86.4,480.7L83.9,482.2L83.9,478.1L80.5,476.7L80.3,472.5L78.5,471.6L78.7,463.2L76.1,461.5L72.9,455.8L72.5,451.2L70.7,450.3L68.5,450.7L64.5,447.4L56.0,445.1L51.6,447.1L50.1,443.6L49.6,436.1L47.0,433.8L44.0,425.3L40.9,421.1L41.2,411.6L34.3,388.0L38.4,384.4L64.5,352.3Z",
  nampula:"M282.0,105.2L283.8,106.9L282.3,109.2L285.3,121.7L283.8,123.4L284.5,124.7L282.3,125.9L282.7,128.0L283.6,127.3L284.0,129.1L286.5,126.5L287.8,129.3L287.5,131.5L286.2,132.4L284.9,131.5L285.4,135.0L284.7,135.0L284.7,138.7L286.6,134.4L288.6,133.5L290.4,135.5L288.2,137.4L290.2,137.8L289.6,140.2L290.5,141.9L290.4,146.1L286.9,149.1L285.9,149.3L285.1,147.8L285.8,150.0L287.8,150.0L288.6,152.4L285.8,151.7L286.9,154.8L284.0,156.5L282.1,156.3L281.6,158.3L283.4,158.9L284.2,157.6L285.5,158.2L285.7,162.0L283.6,165.5L283.2,168.5L281.2,169.2L277.6,175.2L269.6,183.9L269.8,184.5L271.3,183.1L271.5,183.8L267.7,191.3L264.5,192.0L262.1,193.8L262.7,196.6L264.0,197.9L262.3,199.0L262.1,198.1L261.1,198.3L261.6,199.0L259.8,201.1L246.5,210.2L245.0,212.1L242.2,205.6L240.6,204.1L240.7,202.1L242.4,200.4L239.0,190.9L239.3,187.5L236.0,178.8L232.5,174.2L229.2,172.7L228.5,170.9L224.3,167.4L219.9,166.6L218.0,163.5L210.0,158.4L205.9,160.2L201.2,156.7L197.8,159.4L193.3,152.8L179.9,152.6L184.6,145.3L192.1,139.6L193.9,139.9L196.7,138.1L200.4,133.5L203.4,132.8L204.5,129.6L207.7,129.5L210.4,128.0L212.6,130.4L214.3,129.0L218.8,128.0L221.4,125.8L225.5,124.7L232.6,125.4L236.8,124.1L242.2,120.9L243.2,119.1L246.6,119.2L252.6,115.8L254.9,113.2L261.5,110.2L263.8,110.4L271.3,103.2L274.6,104.4L279.1,103.4L280.0,105.1L282.0,105.2ZM265.4,193.0L266.4,193.8L264.6,197.5L263.4,196.6L263.1,194.3L265.4,193.0Z",
};

const NE_LABELS = {
  maputo:[65.3,487.2], cabo:[250.9,71.8], niassa:[172.9,91.3],
  tete:[73.4,169.0],   manica:[91.7,280.8], gaza:[74.8,416.5],
  zambezia:[187.0,205.1], inhambane:[120.8,400.5],
  sofala:[125.3,281.1], nampula:[247.8,151.2],
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// DOMAIN DATA
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const PROV_IDS = ["niassa","cabo","nampula","zambezia","tete","manica","sofala","inhambane","gaza","maputo"];
const PROV_NAME = {
  niassa:"Niassa",cabo:"Cabo Delgado",nampula:"Nampula",
  zambezia:"Zambezia",tete:"Tete",manica:"Manica",
  sofala:"Sofala",inhambane:"Inhambane",gaza:"Gaza",maputo:"Maputo",
};
const PROV_REGION = {
  niassa:"北部",cabo:"北部",nampula:"北部",
  zambezia:"中部",tete:"中部",manica:"中部",sofala:"中部",
  inhambane:"南部",gaza:"南部",maputo:"南部",
};
const RC = {"北部":"#38bdf8","中部":"#a78bfa","南部":"#fb923c"};

const CROPS = [
  {id:"cassava",name:"キャッサバ",cons:1110,prod:{niassa:90,cabo:80,nampula:200,zambezia:250,tete:70,manica:60,sofala:80,inhambane:60,gaza:80,maputo:70}},
  {id:"corn",name:"トウモロコシ",cons:225,prod:{niassa:20,cabo:15,nampula:25,zambezia:60,tete:45,manica:35,sofala:15,inhambane:5,gaza:8,maputo:2}},
  {id:"sweetpot",name:"サツマイモ",cons:115,prod:{niassa:10,cabo:8,nampula:20,zambezia:25,tete:15,manica:12,sofala:8,inhambane:8,gaza:10,maputo:4}},
  {id:"rice",name:"米",cons:97,prod:{niassa:5,cabo:4,nampula:8,zambezia:10,tete:3,manica:3,sofala:5,inhambane:1,gaza:1,maputo:0}},
  {id:"sorghum",name:"ソルガム",cons:40,prod:{niassa:8,cabo:8,nampula:10,zambezia:5,tete:6,manica:2,sofala:1,inhambane:1,gaza:1,maputo:0}},
  {id:"peanut",name:"落花生",cons:25,prod:{niassa:3,cabo:3.5,nampula:8,zambezia:4,tete:2.5,manica:2,sofala:1.5,inhambane:1,gaza:1,maputo:0}},
  {id:"beans",name:"豆類",cons:22,prod:{niassa:4,cabo:3,nampula:5,zambezia:4,tete:4,manica:2,sofala:1,inhambane:0.5,gaza:0.5,maputo:0}},
  {id:"banana",name:"バナナ",cons:17,prod:{niassa:1,cabo:2,nampula:3,zambezia:4,tete:2,manica:2,sofala:2,inhambane:1,gaza:0.5,maputo:0.5}},
];

const MONTHS_S = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const CLIMATE = {
  niassa:   {max:[26,26,25,23,22,20,20,23,26,28,27,26],min:[14,14,13,10,7,5,5,7,10,13,14,14],rain:[200,180,130,50,10,2,1,2,8,40,120,190]},
  cabo:     {max:[32,32,31,30,29,28,27,28,30,32,33,33],min:[24,24,23,22,20,18,17,17,19,21,23,24],rain:[150,140,120,60,20,10,8,8,15,40,100,140]},
  nampula:  {max:[33,33,32,31,30,28,28,30,32,34,34,33],min:[22,22,21,19,17,15,14,15,17,20,22,22],rain:[180,160,110,40,10,3,2,3,10,35,110,160]},
  zambezia: {max:[32,32,31,30,29,27,27,28,30,32,32,32],min:[23,23,22,21,19,17,16,17,19,21,22,23],rain:[220,210,180,80,20,5,3,4,15,50,130,190]},
  tete:     {max:[36,35,34,33,31,29,29,31,34,38,38,37],min:[22,22,21,19,15,13,12,13,16,20,22,22],rain:[110,100,80,25,5,2,1,2,5,25,80,100]},
  manica:   {max:[28,28,27,26,25,23,23,25,27,30,30,29],min:[16,16,15,12,9,7,6,8,11,14,16,16],rain:[200,180,150,60,15,5,3,5,15,50,130,190]},
  sofala:   {max:[33,33,32,30,28,26,26,27,29,31,32,33],min:[24,24,23,21,19,17,16,17,19,21,23,24],rain:[250,230,200,80,20,5,3,5,15,50,130,200]},
  inhambane:{max:[33,33,32,30,28,26,25,26,28,30,32,33],min:[22,22,21,19,16,14,13,14,16,18,21,22],rain:[100,90,70,40,20,15,12,10,15,30,60,90]},
  gaza:     {max:[34,33,32,30,27,25,24,26,28,31,33,34],min:[20,20,19,16,13,10,9,10,13,16,19,20],rain:[80,70,60,30,15,8,6,6,10,25,55,75]},
  maputo:   {max:[31,31,30,28,26,24,23,24,26,28,30,31],min:[21,21,20,17,14,12,11,12,14,17,19,21],rain:[100,90,80,40,20,10,8,8,15,40,70,95]},
};

const ELEV = {
  niassa:   {min:200,avg:1050,max:2100,zone:"高地",    peak:"Serra Mecula 2,100m"},
  cabo:     {min:0,  avg:350, max:1000,zone:"中地",    peak:"Serra Jeci 1,000m"},
  nampula:  {min:0,  avg:500, max:1800,zone:"中地",    peak:"Mt. Ribáuè 1,800m"},
  zambezia: {min:0,  avg:280, max:2419,zone:"低地",    peak:"Mt. Namuli 2,419m"},
  tete:     {min:130,avg:360, max:1400,zone:"中地",    peak:"Serra Tete 1,400m"},
  manica:   {min:200,avg:950, max:2436,zone:"高地",    peak:"Mt. Binga 2,436m ★"},
  sofala:   {min:0,  avg:180, max:800, zone:"沿岸低地", peak:"Serra Gorongosa 800m"},
  inhambane:{min:0,  avg:100, max:400, zone:"沿岸低地", peak:"台地 400m"},
  gaza:     {min:10, avg:150, max:500, zone:"低地",    peak:"台地 500m"},
  maputo:   {min:0,  avg:120, max:600, zone:"沿岸低地", peak:"Libombo 600m"},
};

const SOILS = {
  niassa:   [{n:"フェラルソル",pct:65,c:"#c2813e"},{n:"カンビソル",pct:20,c:"#8bc34a"},{n:"バーティソル",pct:5,c:"#607d8b"},{n:"フルビソル",pct:5,c:"#4caf80"},{n:"アレノソル",pct:5,c:"#d4b870"}],
  cabo:     [{n:"フェラルソル",pct:55,c:"#c2813e"},{n:"アレノソル",pct:20,c:"#d4b870"},{n:"カンビソル",pct:15,c:"#8bc34a"},{n:"フルビソル",pct:10,c:"#4caf80"}],
  nampula:  [{n:"フェラルソル",pct:60,c:"#c2813e"},{n:"カンビソル",pct:15,c:"#8bc34a"},{n:"アレノソル",pct:15,c:"#d4b870"},{n:"フルビソル",pct:10,c:"#4caf80"}],
  zambezia: [{n:"フェラルソル",pct:55,c:"#c2813e"},{n:"フルビソル",pct:25,c:"#4caf80"},{n:"カンビソル",pct:10,c:"#8bc34a"},{n:"バーティソル",pct:5,c:"#607d8b"},{n:"アレノソル",pct:5,c:"#d4b870"}],
  tete:     [{n:"バーティソル",pct:40,c:"#607d8b"},{n:"フェラルソル",pct:30,c:"#c2813e"},{n:"カンビソル",pct:20,c:"#8bc34a"},{n:"レプトソル",pct:10,c:"#9e7a5b"}],
  manica:   [{n:"フェラルソル",pct:65,c:"#c2813e"},{n:"カンビソル",pct:20,c:"#8bc34a"},{n:"バーティソル",pct:10,c:"#607d8b"},{n:"レプトソル",pct:5,c:"#9e7a5b"}],
  sofala:   [{n:"フルビソル",pct:50,c:"#4caf80"},{n:"フェラルソル",pct:20,c:"#c2813e"},{n:"バーティソル",pct:15,c:"#607d8b"},{n:"アレノソル",pct:15,c:"#d4b870"}],
  inhambane:[{n:"アレノソル",pct:60,c:"#d4b870"},{n:"フェラルソル",pct:20,c:"#c2813e"},{n:"フルビソル",pct:15,c:"#4caf80"},{n:"バーティソル",pct:5,c:"#607d8b"}],
  gaza:     [{n:"アレノソル",pct:55,c:"#d4b870"},{n:"バーティソル",pct:25,c:"#607d8b"},{n:"フルビソル",pct:15,c:"#4caf80"},{n:"フェラルソル",pct:5,c:"#c2813e"}],
  maputo:   [{n:"アレノソル",pct:65,c:"#d4b870"},{n:"フェラルソル",pct:15,c:"#c2813e"},{n:"フルビソル",pct:15,c:"#4caf80"},{n:"バーティソル",pct:5,c:"#607d8b"}],
};

const SOIL_LEGEND = [
  {c:"#c2813e",n:"フェラルソル",desc:"赤黄ラテライト。強酸性・低肥沃。北・中部高地に卓越。"},
  {c:"#607d8b",n:"バーティソル",desc:"膨張性重粘土。乾湿で収縮・膨張。耕作困難。Tete・Gazaに多い。"},
  {c:"#4caf80",n:"フルビソル",  desc:"河川沖積土。肥沃で農業適性高。Zambezi河口・Sofala沿岸。"},
  {c:"#d4b870",n:"アレノソル",  desc:"砂質土。保水・保肥力低。南部3州に卓越。干ばつリスク高。"},
  {c:"#8bc34a",n:"カンビソル",  desc:"中程度風化の褐色土。山岳傾斜地・森林帯に分布。"},
  {c:"#9e7a5b",n:"レプトソル",  desc:"浅在土（岩盤直上）。農業適性低。急傾斜地・露岩地帯。"},
];

const NS_PROFILE = [
  {x:"11°S",e:500},{x:"12°S",e:900},{x:"13°S",e:1150},{x:"14°S",e:950},
  {x:"15°S",e:650},{x:"16°S",e:500},{x:"17°S",e:350},{x:"18°S",e:250},
  {x:"19°S",e:180},{x:"21°S",e:150},{x:"23°S",e:115},{x:"25°S",e:110},{x:"26°S",e:80},
];
const EW_PROFILE = [
  {x:"31°E",e:280},{x:"32°E",e:360},{x:"33°E",e:430},{x:"34°E",e:700},
  {x:"34.5°E",e:950},{x:"35°E",e:800},{x:"36°E",e:460},
  {x:"37°E",e:300},{x:"38°E",e:140},{x:"39°E",e:40},
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// HELPERS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function elevColor(avg){
  if(avg<150)return"#1a5c35";if(avg<300)return"#237a4a";
  if(avg<500)return"#4a9960";if(avg<700)return"#7aad4c";
  if(avg<1000)return"#c49d3e";return"#a87c3e";
}
function totalProd(c){return Object.values(c.prod).reduce((a,b)=>a+b,0);}
function selfRate(p,c){const r=(p/c)*100;return{pct:Math.round(r),color:r>=100?"#10b981":r>=70?"#f59e0b":"#ef4444"};}
function annualRain(id){return CLIMATE[id].rain.reduce((a,b)=>a+b,0);}
function avgMax(id){return(CLIMATE[id].max.reduce((a,b)=>a+b,0)/12).toFixed(1);}
function avgMin(id){return(CLIMATE[id].min.reduce((a,b)=>a+b,0)/12).toFixed(1);}

const CARD={background:"rgba(255,255,255,0.04)",borderRadius:12,border:"1px solid rgba(255,255,255,0.08)",padding:"12px",marginBottom:10};
const TT={contentStyle:{background:"rgba(4,9,20,0.97)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,fontSize:10,color:"#f1f5f9"},cursor:{fill:"rgba(255,255,255,0.04)"}};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MAP COMPONENT — shared between Overview & Terrain
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function ProvinceMap({mode, selected, onSelect, mini=false}){
  const W=300, H=540;
  const scale = mini ? 0.36 : 1;
  const vw = W, vh = H;

  function getFill(id){
    if(mode==="region") return RC[PROV_REGION[id]];
    return SOILS[id][0].c;
  }

  return(
    <svg viewBox={`0 0 ${vw} ${vh}`}
      style={{width:"100%", maxWidth: mini?110:340, display:"block", margin:"0 auto"}}>
      <rect width={vw} height={vh} fill="#071828"/>
      {PROV_IDS.map(id=>(
        <g key={id} onClick={()=>onSelect&&onSelect(id)} style={{cursor:onSelect?"pointer":"default"}}>
          <path d={NE_PATHS[id]}
            fill={getFill(id)}
            stroke={selected===id?"#ffffff":"rgba(0,0,0,0.5)"}
            strokeWidth={selected===id?1.5:0.6}
            opacity={selected===id?1:0.88}
          />
          {!mini && (
            <text
              x={NE_LABELS[id][0]} y={NE_LABELS[id][1]}
              textAnchor="middle"
              fontSize={selected===id?8:6.5}
              fill={selected===id?"#fff":"rgba(255,255,255,0.75)"}
              fontWeight={selected===id?"700":"400"}
              style={{pointerEvents:"none",fontFamily:"monospace"}}
            >
              {PROV_NAME[id].split(" ")[0]}
            </text>
          )}
        </g>
      ))}
      {!mini&&<>
        <text x="290" y="525" textAnchor="middle" fontSize="8" fill="#1e3a5f" fontFamily="monospace">N↑</text>
        <line x1="8" y1="532" x2="62" y2="532" stroke="#334155" strokeWidth="1.5"/>
        <line x1="8" y1="529" x2="8" y2="535" stroke="#334155" strokeWidth="1"/>
        <line x1="62" y1="529" x2="62" y2="535" stroke="#334155" strokeWidth="1"/>
        <text x="35" y="539" textAnchor="middle" fontSize="6.5" fill="#334155" fontFamily="monospace">200km</text>
        <text x="298" y="290" textAnchor="middle" fontSize="5.5" fill="#1a3550" fontFamily="serif"
          transform="rotate(-90,298,290)">INDIAN OCEAN</text>
      </>}
    </svg>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// OVERVIEW TAB
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function OverviewTab(){
  const topCrops = CROPS.map(c=>({name:c.name,生産:totalProd(c),消費:c.cons})).sort((a,b)=>b.生産-a.生産);
  return(
    <div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
        {[
          {label:"州数",value:"10",sub:"Provinces",c:"#38bdf8"},
          {label:"主要作物",value:"8",sub:"Crops",c:"#d97706"},
          {label:"最高気温",value:"38°C",sub:"Tete 10-11月",c:"#ef4444"},
          {label:"最高峰",value:"2,436m",sub:"Mt. Binga (Manica)",c:"#7aad4c"},
        ].map(({label,value,sub,c})=>(
          <div key={label} style={{...CARD,margin:0,borderLeft:`3px solid ${c}`,background:`linear-gradient(135deg,${c}10,rgba(255,255,255,0.02))`}}>
            <div style={{fontSize:8,letterSpacing:"0.12em",color:"#475569",fontFamily:"monospace"}}>{label}</div>
            <div style={{fontSize:20,fontWeight:700,color:c,lineHeight:1.1,margin:"3px 0"}}>{value}</div>
            <div style={{fontSize:9,color:"#334155"}}>{sub}</div>
          </div>
        ))}
      </div>

      <div style={CARD}>
        <div style={{fontSize:10,color:"#475569",letterSpacing:"0.1em",marginBottom:8,fontFamily:"monospace"}}>地域区分 / REGIONAL OVERVIEW</div>
        <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
          <ProvinceMap mode="region" mini={true}/>
          <div style={{flex:1}}>
            {["北部","中部","南部"].map(region=>{
              const ids=PROV_IDS.filter(id=>PROV_REGION[id]===region);
              return(
                <div key={region} style={{marginBottom:9}}>
                  <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:3}}>
                    <div style={{width:8,height:8,borderRadius:2,background:RC[region]}}/>
                    <span style={{fontSize:10,color:RC[region],fontWeight:700}}>{region}</span>
                  </div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:3}}>
                    {ids.map(id=>(
                      <span key={id} style={{fontSize:9,color:"#94a3b8",background:"rgba(255,255,255,0.05)",borderRadius:4,padding:"1px 5px"}}>{PROV_NAME[id]}</span>
                    ))}
                  </div>
                </div>
              );
            })}
            <div style={{padding:"5px 7px",background:"rgba(255,255,255,0.04)",borderRadius:6,fontSize:9,color:"#64748b",lineHeight:1.6}}>
              面積 801,590 km²<br/>人口 3,320万人（2024推計）<br/>海岸線 2,515 km
            </div>
          </div>
        </div>
      </div>

      <div style={CARD}>
        <div style={{fontSize:10,color:"#475569",letterSpacing:"0.1em",marginBottom:8,fontFamily:"monospace"}}>🌾 主要作物 生産量 vs 消費量（万t）</div>
        <ResponsiveContainer width="100%" height={190}>
          <BarChart data={topCrops} layout="vertical" margin={{top:0,right:10,left:50,bottom:0}}>
            <CartesianGrid strokeDasharray="2 5" stroke="rgba(255,255,255,0.05)" horizontal={false}/>
            <XAxis type="number" tick={{fill:"#475569",fontSize:8}} axisLine={false} tickLine={false}/>
            <YAxis dataKey="name" type="category" tick={{fill:"#94a3b8",fontSize:9}} axisLine={false} tickLine={false} width={50}/>
            <Tooltip {...TT} formatter={(v,n)=>[`${v}万t`,n]}/>
            <Bar dataKey="生産" fill="#10b981" radius={[0,3,3,0]} barSize={8}/>
            <Bar dataKey="消費" fill="#6366f1" radius={[0,3,3,0]} barSize={8}/>
            <Legend iconType="circle" iconSize={7} wrapperStyle={{fontSize:10,color:"#94a3b8",paddingTop:4}}/>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={CARD}>
        <div style={{fontSize:10,color:"#475569",letterSpacing:"0.1em",marginBottom:8,fontFamily:"monospace"}}>☁️ 気候エクストリーム</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:10}}>
          {[{label:"最高気温",value:"38°C",where:"Tete (10-11月)",c:"#ef4444"},{label:"最低気温",value:"5°C",where:"Niassa (7月)",c:"#67e8f9"},{label:"最多年降水",value:"1,188mm",where:"Sofala",c:"#3b82f6"},{label:"最少年降水",value:"535mm",where:"Tete",c:"#f59e0b"}].map(({label,value,where,c})=>(
            <div key={label} style={{background:"rgba(255,255,255,0.04)",borderRadius:8,padding:"7px 8px",borderLeft:`2px solid ${c}40`}}>
              <div style={{fontSize:8,color:"#475569",marginBottom:2}}>{label}</div>
              <div style={{fontSize:16,fontWeight:700,color:c}}>{value}</div>
              <div style={{fontSize:9,color:"#334155"}}>{where}</div>
            </div>
          ))}
        </div>
        <div style={{fontSize:9,color:"#475569",marginBottom:5}}>全州 自給率スナップショット</div>
        {CROPS.slice(0,5).map(c=>{
          const p=totalProd(c);const sr=selfRate(p,c.cons);
          return(
            <div key={c.id} style={{display:"flex",alignItems:"center",gap:8,marginBottom:5}}>
              <div style={{width:60,fontSize:9,color:"#94a3b8",textAlign:"right"}}>{c.name}</div>
              <div style={{flex:1,position:"relative",height:8,background:"rgba(255,255,255,0.07)",borderRadius:4}}>
                <div style={{position:"absolute",width:`${Math.min(sr.pct,100)}%`,height:"100%",background:sr.color,borderRadius:4}}/>
              </div>
              <div style={{width:36,fontSize:9,color:sr.color,textAlign:"right",fontVariantNumeric:"tabular-nums"}}>{sr.pct}%</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// AGRICULTURE TAB
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function AgriTab(){
  const [viewMode,setViewMode]=useState("crop");
  const [selCrop,setSelCrop]=useState("cassava");
  const [selProv,setSelProv]=useState("zambezia");

  const crop=CROPS.find(c=>c.id===selCrop);
  const provProd=totalProd(crop);
  const sr=selfRate(provProd,crop.cons);
  const cropChartData=PROV_IDS.map(id=>({name:id==="inhambane"?"Inhbn":PROV_NAME[id].slice(0,6),生産:crop.prod[id]}));
  const provChartData=CROPS.map(c=>{const p=c.prod[selProv];const s=selfRate(p,c.cons/10);return{name:c.name,生産:p,sr:s.pct,src:s.color};});

  return(
    <div>
      <div style={{...CARD,padding:"8px 10px"}}>
        <div style={{display:"flex",gap:6,marginBottom:8}}>
          {[["crop","🌽 作物別"],["province","📍 州別"]].map(([m,l])=>(
            <button key={m} onClick={()=>setViewMode(m)} style={{padding:"4px 12px",borderRadius:16,border:"none",cursor:"pointer",fontSize:11,fontWeight:viewMode===m?700:400,background:viewMode===m?"rgba(217,119,6,0.25)":"rgba(255,255,255,0.05)",color:viewMode===m?"#fbbf24":"#64748b",outline:viewMode===m?"1.5px solid #d9770680":"1.5px solid transparent"}}>{l}</button>
          ))}
        </div>
        {viewMode==="crop"?(
          <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
            {CROPS.map(c=>(
              <button key={c.id} onClick={()=>setSelCrop(c.id)} style={{padding:"3px 8px",borderRadius:8,border:"none",cursor:"pointer",fontSize:10,fontWeight:selCrop===c.id?700:400,background:selCrop===c.id?"rgba(16,185,129,0.2)":"rgba(255,255,255,0.04)",color:selCrop===c.id?"#10b981":"#64748b",outline:selCrop===c.id?"1px solid #10b98140":"1px solid transparent"}}>{c.name}</button>
            ))}
          </div>
        ):(
          <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
            {PROV_IDS.map(id=>(
              <button key={id} onClick={()=>setSelProv(id)} style={{padding:"3px 8px",borderRadius:8,border:"none",cursor:"pointer",fontSize:10,fontWeight:selProv===id?700:400,background:selProv===id?`${RC[PROV_REGION[id]]}25`:"rgba(255,255,255,0.04)",color:selProv===id?RC[PROV_REGION[id]]:"#64748b",outline:selProv===id?`1px solid ${RC[PROV_REGION[id]]}50`:"1px solid transparent"}}>{PROV_NAME[id]}</button>
            ))}
          </div>
        )}
      </div>

      {viewMode==="crop"&&(
        <div style={{...CARD,padding:"10px 12px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
            <div><div style={{fontSize:15,fontWeight:700,color:"#fbbf24"}}>{crop.name}</div><div style={{fontSize:9,color:"#64748b",marginTop:1}}>全国データ</div></div>
            <div style={{textAlign:"right",fontSize:10,fontFamily:"monospace",lineHeight:2}}>
              <div style={{color:"#10b981"}}>生産 <strong>{provProd.toFixed(1)}万t</strong></div>
              <div style={{color:"#6366f1"}}>消費 <strong>{crop.cons}万t</strong></div>
              <div style={{color:sr.color}}>自給率 <strong>{sr.pct}%</strong></div>
            </div>
          </div>
          <div style={{marginTop:8,position:"relative",height:8,background:"rgba(255,255,255,0.07)",borderRadius:4}}>
            <div style={{position:"absolute",width:`${Math.min(sr.pct,100)}%`,height:"100%",background:sr.color,borderRadius:4}}/>
          </div>
        </div>
      )}

      <div style={CARD}>
        <div style={{fontSize:9,color:"#475569",marginBottom:8,fontFamily:"monospace"}}>
          {viewMode==="crop"?`${crop.name} — 州別生産量（万t）`:`${PROV_NAME[selProv]}州 — 作物別生産量（万t）`}
        </div>
        <ResponsiveContainer width="100%" height={200}>
          {viewMode==="crop"?(
            <BarChart data={cropChartData} margin={{top:4,right:6,left:-20,bottom:0}}>
              <CartesianGrid strokeDasharray="2 5" stroke="rgba(255,255,255,0.05)" vertical={false}/>
              <XAxis dataKey="name" tick={{fill:"#475569",fontSize:8}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:"#475569",fontSize:8}} axisLine={false} tickLine={false}/>
              <Tooltip {...TT} formatter={(v)=>[`${v}万t`]}/>
              <Bar dataKey="生産" fill="#10b981" radius={[3,3,0,0]} barSize={18}>
                {cropChartData.map((d,i)=>(<Cell key={i} fill={d.生産===Math.max(...cropChartData.map(x=>x.生産))?"#10b981":"#0d9488"}/>))}
              </Bar>
            </BarChart>
          ):(
            <BarChart data={provChartData} layout="vertical" margin={{top:0,right:10,left:55,bottom:0}}>
              <CartesianGrid strokeDasharray="2 5" stroke="rgba(255,255,255,0.05)" horizontal={false}/>
              <XAxis type="number" tick={{fill:"#475569",fontSize:8}} axisLine={false} tickLine={false}/>
              <YAxis dataKey="name" type="category" tick={{fill:"#94a3b8",fontSize:9}} axisLine={false} tickLine={false} width={55}/>
              <Tooltip {...TT} formatter={(v)=>[`${v}万t`]}/>
              <Bar dataKey="生産" fill="#10b981" radius={[0,3,3,0]} barSize={10}>
                {provChartData.map((d,i)=>(<Cell key={i} fill={d.生産===0?"#1e3a30":d.sr>=100?"#10b981":d.sr>=70?"#f59e0b":"#ef4444"}/>))}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      <div style={CARD}>
        <div style={{fontSize:9,color:"#475569",letterSpacing:"0.08em",marginBottom:8,fontFamily:"monospace"}}>全作物 自給率サマリー</div>
        {CROPS.map(c=>{const p=totalProd(c);const sr2=selfRate(p,c.cons);return(
          <div key={c.id} style={{display:"grid",gridTemplateColumns:"64px 1fr 46px",alignItems:"center",gap:8,marginBottom:5,cursor:"pointer",opacity:viewMode==="crop"&&selCrop===c.id?1:0.7}} onClick={()=>{setViewMode("crop");setSelCrop(c.id);}}>
            <div style={{fontSize:10,color:"#94a3b8"}}>{c.name}</div>
            <div style={{position:"relative",height:8,background:"rgba(255,255,255,0.06)",borderRadius:4}}>
              <div style={{position:"absolute",width:`${Math.min(sr2.pct,100)}%`,height:"100%",background:sr2.color,borderRadius:4,opacity:0.8}}/>
            </div>
            <div style={{fontSize:10,color:sr2.color,textAlign:"right",fontVariantNumeric:"tabular-nums"}}>{sr2.pct}%</div>
          </div>
        );})}
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CLIMATE TAB
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function ClimateTab(){
  const [selProv,setSelProv]=useState("maputo");
  const d=CLIMATE[selProv];
  const chartData=MONTHS_S.map((m,i)=>({month:m,最高気温:d.max[i],最低気温:d.min[i],降水量:d.rain[i]}));
  const totalRain=d.rain.reduce((a,b)=>a+b,0);
  const rc=RC[PROV_REGION[selProv]];

  return(
    <div>
      <div style={{...CARD,padding:"8px 10px"}}>
        {["北部","中部","南部"].map(region=>(
          <div key={region} style={{marginBottom:7}}>
            <div style={{fontSize:8,letterSpacing:"0.15em",color:RC[region],marginBottom:3,fontFamily:"monospace"}}>{region}</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
              {PROV_IDS.filter(id=>PROV_REGION[id]===region).map(id=>(
                <button key={id} onClick={()=>setSelProv(id)} style={{padding:"3px 9px",borderRadius:8,border:"none",cursor:"pointer",fontSize:10,fontWeight:selProv===id?700:400,background:selProv===id?`${RC[region]}25`:"rgba(255,255,255,0.04)",color:selProv===id?RC[region]:"#64748b",outline:selProv===id?`1px solid ${RC[region]}50`:"1px solid transparent"}}>{PROV_NAME[id]}</button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{...CARD,borderLeft:`3px solid ${rc}`,background:`linear-gradient(90deg,${rc}0d,transparent)`}}>
        <div style={{fontSize:14,fontWeight:700,color:"#f1f5f9",marginBottom:6}}>{PROV_NAME[selProv]}州</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6}}>
          {[{label:"年間降水",value:`${totalRain}mm`,c:"#60a5fa"},{label:"最高気温",value:`${Math.max(...d.max)}°C`,c:"#f87171"},{label:"最低気温",value:`${Math.min(...d.min)}°C`,c:"#67e8f9"},{label:"乾季",value:d.rain.filter(r=>r<20).length+"ヶ月",c:"#fbbf24"}].map(({label,value,c})=>(
            <div key={label} style={{background:"rgba(255,255,255,0.04)",borderRadius:7,padding:"6px 5px",textAlign:"center"}}>
              <div style={{fontSize:8,color:"#475569",marginBottom:2}}>{label}</div>
              <div style={{fontSize:13,fontWeight:700,color:c}}>{value}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={CARD}>
        <div style={{fontSize:9,color:"#475569",marginBottom:8,fontFamily:"monospace"}}>月別 気温（左軸 °C）/ 降水量（右軸 mm）</div>
        <ResponsiveContainer width="100%" height={220}>
          <ComposedChart data={chartData} margin={{top:4,right:36,left:-22,bottom:0}}>
            <CartesianGrid strokeDasharray="2 5" stroke="rgba(255,255,255,0.05)"/>
            <XAxis dataKey="month" tick={{fill:"#475569",fontSize:9}} axisLine={false} tickLine={false}/>
            <YAxis yAxisId="t" domain={[0,45]} tick={{fill:"#475569",fontSize:8}} axisLine={false} tickLine={false} tickFormatter={v=>`${v}°`}/>
            <YAxis yAxisId="r" orientation="right" domain={[0,300]} tick={{fill:"#475569",fontSize:8}} axisLine={false} tickLine={false}/>
            <Tooltip {...TT} formatter={(v,n)=>n==="降水量"?[`${v}mm`,n]:[`${v}°C`,n]}/>
            <Legend iconType="circle" iconSize={7} wrapperStyle={{fontSize:10,color:"#94a3b8",paddingTop:6}}/>
            <Bar yAxisId="r" dataKey="降水量" fill="#3b82f6" opacity={0.55} radius={[2,2,0,0]} barSize={16}/>
            <Line yAxisId="t" type="monotone" dataKey="最高気温" stroke="#f87171" strokeWidth={2.5} dot={{r:2.5,fill:"#f87171",strokeWidth:0}} activeDot={{r:4}}/>
            <Line yAxisId="t" type="monotone" dataKey="最低気温" stroke="#67e8f9" strokeWidth={2} strokeDasharray="5 2" dot={{r:2.5,fill:"#67e8f9",strokeWidth:0}} activeDot={{r:4}}/>
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div style={CARD}>
        <div style={{fontSize:9,color:"#475569",letterSpacing:"0.08em",marginBottom:8,fontFamily:"monospace"}}>全州 年間比較</div>
        {PROV_IDS.map(id=>{
          const rain=annualRain(id);const isSel=id===selProv;const r=RC[PROV_REGION[id]];
          return(
            <div key={id} onClick={()=>setSelProv(id)} style={{display:"grid",gridTemplateColumns:"72px 36px 36px 1fr 44px",alignItems:"center",gap:6,padding:"4px 7px",borderRadius:7,cursor:"pointer",background:isSel?`${r}10`:"transparent",border:isSel?`1px solid ${r}28`:"1px solid transparent",marginBottom:3}}>
              <div style={{fontSize:10,color:isSel?r:"#94a3b8",fontWeight:isSel?700:400}}>{PROV_NAME[id]}</div>
              <div style={{fontSize:9,color:"#f87171",textAlign:"right",fontVariantNumeric:"tabular-nums"}}>{avgMax(id)}°</div>
              <div style={{fontSize:9,color:"#67e8f9",textAlign:"right",fontVariantNumeric:"tabular-nums"}}>{avgMin(id)}°</div>
              <div style={{position:"relative",height:6,background:"rgba(255,255,255,0.05)",borderRadius:3}}>
                <div style={{position:"absolute",width:`${(rain/1300)*100}%`,height:"100%",background:"linear-gradient(90deg,#3b82f6,#60a5fa)",borderRadius:3}}/>
              </div>
              <div style={{fontSize:9,color:"#60a5fa",textAlign:"right",fontVariantNumeric:"tabular-nums"}}>{rain}mm</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TERRAIN TAB
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function TerrainTab(){
  const [mapMode,setMapMode]=useState("region");  // "region" | "soil"
  const [selProv,setSelProv]=useState("manica");
  const [section,setSection]=useState("ns");

  const elev=ELEV[selProv];
  const soils=SOILS[selProv];
  const rc=RC[PROV_REGION[selProv]];
  const sectionData=section==="ns"?NS_PROFILE:EW_PROFILE;

  return(
    <div>
      {/* Map mode toggle */}
      <div style={{...CARD,padding:"8px 10px"}}>
        <div style={{display:"flex",gap:6}}>
          {[["region","🗺️ 地域区分"],["soil","🌱 土壌分布"]].map(([m,l])=>(
            <button key={m} onClick={()=>setMapMode(m)} style={{padding:"4px 14px",borderRadius:16,border:"none",cursor:"pointer",fontSize:11,fontWeight:mapMode===m?700:400,background:mapMode===m?"rgba(101,163,13,0.25)":"rgba(255,255,255,0.05)",color:mapMode===m?"#84cc16":"#64748b",outline:mapMode===m?"1.5px solid #65a30d80":"1.5px solid transparent"}}>{l}</button>
          ))}
        </div>
      </div>

      {/* Map */}
      <div style={CARD}>
        <div style={{fontSize:9,color:"#475569",fontFamily:"monospace",marginBottom:6}}>
          {mapMode==="region"?"北部 / 中部 / 南部 — タップ → 詳細":"優占土壌タイプ — タップ → 詳細"}
        </div>
        <ProvinceMap mode={mapMode} selected={selProv} onSelect={setSelProv}/>

        {/* Legend */}
        <div style={{display:"flex",flexWrap:"wrap",gap:5,marginTop:10,paddingLeft:2}}>
          {mapMode==="region"
            ? ["北部","中部","南部"].map(r=>(
                <div key={r} style={{display:"flex",alignItems:"center",gap:4}}>
                  <div style={{width:10,height:10,borderRadius:2,background:RC[r]}}/>
                  <span style={{fontSize:9,color:"#475569"}}>{r}</span>
                </div>
              ))
            : SOIL_LEGEND.map(({c,n})=>(
                <div key={n} style={{display:"flex",alignItems:"center",gap:3}}>
                  <div style={{width:10,height:10,borderRadius:2,background:c}}/>
                  <span style={{fontSize:8.5,color:"#475569"}}>{n}</span>
                </div>
              ))
          }
        </div>
      </div>

      {/* Soil legend detail (soil mode only) */}
      {mapMode==="soil"&&(
        <div style={CARD}>
          <div style={{fontSize:9,color:"#475569",letterSpacing:"0.08em",marginBottom:8,fontFamily:"monospace"}}>土壌タイプ 解説</div>
          {SOIL_LEGEND.map(({c,n,desc})=>(
            <div key={n} style={{display:"flex",gap:8,alignItems:"flex-start",marginBottom:7,paddingBottom:7,borderBottom:"1px solid rgba(255,255,255,0.05)"}}>
              <div style={{width:12,height:12,borderRadius:3,background:c,flexShrink:0,marginTop:1}}/>
              <div>
                <div style={{fontSize:10,color:"#e2e8f0",fontWeight:600,marginBottom:1}}>{n}</div>
                <div style={{fontSize:9,color:"#64748b",lineHeight:1.6}}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Province detail */}
      <div style={{...CARD,borderLeft:`3px solid ${rc}`,background:`linear-gradient(90deg,${rc}0a,transparent)`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
          <div>
            <div style={{fontSize:14,fontWeight:700,color:"#f1f5f9"}}>{PROV_NAME[selProv]}州</div>
            <div style={{fontSize:10,color:rc,marginTop:2}}>{elev.zone} | {PROV_REGION[selProv]}</div>
          </div>
          <div style={{textAlign:"right",fontSize:10,fontFamily:"monospace",lineHeight:2}}>
            <div style={{color:"#fbbf24"}}>最高 <strong>{elev.max.toLocaleString()}m</strong></div>
            <div style={{color:"#e2e8f0"}}>平均 <strong>{elev.avg.toLocaleString()}m</strong></div>
            <div style={{color:"#a5f3fc"}}>最低 <strong>{elev.min}m</strong></div>
          </div>
        </div>
        {/* Elevation bar */}
        <div style={{fontSize:9,color:"#334155",marginBottom:3}}>標高レンジ（0〜2,500m スケール）</div>
        <div style={{position:"relative",height:12,background:"rgba(255,255,255,0.06)",borderRadius:6,overflow:"hidden",marginBottom:4}}>
          <div style={{position:"absolute",left:`${(elev.min/2500)*100}%`,width:`${((elev.max-elev.min)/2500)*100}%`,height:"100%",background:`linear-gradient(90deg,#237a4a,${elevColor(elev.avg)},#c49d3e)`,borderRadius:6}}/>
          <div style={{position:"absolute",left:`${(elev.avg/2500)*100}%`,width:2,height:"100%",background:"#fff",opacity:0.9}}/>
        </div>
        <div style={{fontSize:9,color:"#475569",marginBottom:10}}>▲ {elev.peak}</div>
        {/* Soil bar */}
        <div style={{fontSize:9,color:"#334155",marginBottom:4}}>土壌構成比</div>
        <div style={{display:"flex",height:14,borderRadius:4,overflow:"hidden",marginBottom:6}}>
          {soils.map(s=>(<div key={s.n} style={{width:`${s.pct}%`,background:s.c,borderRight:"1px solid rgba(0,0,0,0.1)"}}/>))}
        </div>
        <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
          {soils.map(s=>(<div key={s.n} style={{display:"flex",alignItems:"center",gap:3}}><div style={{width:7,height:7,borderRadius:2,background:s.c}}/><span style={{fontSize:8.5,color:"#94a3b8"}}>{s.n} {s.pct}%</span></div>))}
        </div>
      </div>

      {/* Cross section */}
      <div style={CARD}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
          <div style={{fontSize:9,color:"#475569",fontFamily:"monospace"}}>地形断面図</div>
          <div style={{display:"flex",gap:5}}>
            {[["ns","南北 35°E"],["ew","東西 17°S"]].map(([s,l])=>(
              <button key={s} onClick={()=>setSection(s)} style={{padding:"2px 8px",borderRadius:10,border:"none",cursor:"pointer",fontSize:9,background:section===s?"rgba(56,189,248,0.2)":"rgba(255,255,255,0.05)",color:section===s?"#38bdf8":"#475569",outline:section===s?"1px solid #38bdf840":"1px solid transparent"}}>{l}</button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={140}>
          <AreaChart data={sectionData} margin={{top:4,right:6,left:-24,bottom:0}}>
            <defs>
              <linearGradient id="tg3" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7aad4c" stopOpacity={0.85}/>
                <stop offset="100%" stopColor="#1a3a1a" stopOpacity={0.95}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="2 6" stroke="rgba(255,255,255,0.04)"/>
            <XAxis dataKey="x" tick={{fill:"#475569",fontSize:8,fontFamily:"monospace"}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fill:"#475569",fontSize:8}} axisLine={false} tickLine={false} domain={[0,section==="ns"?1300:1050]}/>
            <Tooltip {...TT} formatter={(v)=>[`${v}m`,"標高"]}/>
            <Area type="monotone" dataKey="e" stroke="#7aad4c" strokeWidth={2} fill="url(#tg3)"/>
          </AreaChart>
        </ResponsiveContainer>
        <div style={{marginTop:6,padding:"5px 8px",background:"rgba(56,189,248,0.05)",borderRadius:6,borderLeft:"2px solid rgba(56,189,248,0.2)",fontSize:9,color:"#334155",lineHeight:1.7}}>
          {section==="ns"?"縦断面：北（Tanzania国境10.5°S）→ 南（南アフリカ国境26.5°S）、経度約35°E":"横断面：西（Zambia国境31°E）→ 東（インド洋39°E）、緯度17°S（Tete〜Sofala帯）"}
        </div>
      </div>

      {/* Elevation ranking */}
      <div style={CARD}>
        <div style={{fontSize:9,color:"#475569",letterSpacing:"0.08em",marginBottom:8,fontFamily:"monospace"}}>全州 標高ランキング（平均）</div>
        {[...PROV_IDS].sort((a,b)=>ELEV[b].avg-ELEV[a].avg).map(id=>{
          const e=ELEV[id];const isSel=id===selProv;const r=RC[PROV_REGION[id]];
          return(
            <div key={id} onClick={()=>setSelProv(id)} style={{display:"grid",gridTemplateColumns:"72px 1fr 50px",alignItems:"center",gap:8,marginBottom:4,padding:"4px 7px",borderRadius:7,cursor:"pointer",background:isSel?`${r}10`:"transparent",border:isSel?`1px solid ${r}28`:"1px solid transparent"}}>
              <div style={{fontSize:10,color:isSel?r:"#94a3b8",fontWeight:isSel?700:400}}>{PROV_NAME[id]}</div>
              <div style={{position:"relative",height:8,background:"rgba(255,255,255,0.05)",borderRadius:4}}>
                <div style={{position:"absolute",left:`${(e.min/2500)*100}%`,width:`${((e.max-e.min)/2500)*100}%`,height:"100%",background:`${elevColor(e.avg)}50`,borderRadius:4}}/>
                <div style={{position:"absolute",left:`${(e.avg/2500)*100}%`,width:3,height:"100%",background:elevColor(e.avg),borderRadius:2}}/>
              </div>
              <div style={{fontSize:10,color:elevColor(e.avg),textAlign:"right",fontVariantNumeric:"tabular-nums"}}>{e.avg}m</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MAIN APP
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const TABS=[
  {id:"overview",icon:"🌍",label:"概要",  color:"#6366f1"},
  {id:"agri",    icon:"🌾",label:"農業",  color:"#d97706"},
  {id:"climate", icon:"☁️", label:"気候",  color:"#0891b2"},
  {id:"terrain", icon:"🗺️", label:"地形",  color:"#65a30d"},
];

export default function App(){
  const [tab,setTab]=useState("overview");
  const active=TABS.find(t=>t.id===tab);

  return(
    <div style={{minHeight:"100vh",background:"linear-gradient(160deg,#040c1a 0%,#081525 60%,#050d1b 100%)",color:"#f1f5f9",fontFamily:"'Palatino Linotype','Book Antiqua',Georgia,serif",paddingBottom:70}}>
      {/* Header */}
      <div style={{position:"sticky",top:0,zIndex:50,background:"rgba(4,12,26,0.96)",backdropFilter:"blur(12px)",borderBottom:"1px solid rgba(255,255,255,0.07)",padding:"10px 16px 8px",display:"flex",alignItems:"center",gap:10}}>
        <div style={{width:32,height:32,borderRadius:8,flexShrink:0,background:`linear-gradient(135deg,${active.color}40,${active.color}18)`,border:`1px solid ${active.color}50`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>{active.icon}</div>
        <div>
          <div style={{fontSize:9,letterSpacing:"0.22em",color:"#334155",fontFamily:"monospace"}}>MOZAMBIQUE DATA ATLAS</div>
          <div style={{fontSize:13,fontWeight:700,color:"#f1f5f9",lineHeight:1.1}}>{active.label==="概要"?"モザンビーク 総合概要":active.label==="農業"?"農業生産・消費データ":active.label==="気候"?"月別気候データ":"地形・土壌区分"}</div>
        </div>
        <div style={{marginLeft:"auto",fontSize:8,color:"#334155",fontFamily:"monospace",textAlign:"right",lineHeight:1.7}}>推計値<br/>2024年基準</div>
      </div>

      {/* Content */}
      <div style={{padding:"12px 14px 4px"}}>
        {tab==="overview"&&<OverviewTab/>}
        {tab==="agri"    &&<AgriTab/>}
        {tab==="climate" &&<ClimateTab/>}
        {tab==="terrain" &&<TerrainTab/>}
      </div>

      {/* Bottom tab bar */}
      <div style={{position:"fixed",bottom:0,left:0,right:0,zIndex:50,background:"rgba(4,12,26,0.97)",backdropFilter:"blur(16px)",borderTop:"1px solid rgba(255,255,255,0.08)",display:"flex"}}>
        {TABS.map(t=>{
          const isActive=tab===t.id;
          return(
            <button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,padding:"8px 0 10px",border:"none",cursor:"pointer",background:"transparent",display:"flex",flexDirection:"column",alignItems:"center",gap:2,transition:"all 0.18s"}}>
              <div style={{fontSize:18,lineHeight:1,filter:isActive?"none":"grayscale(1) opacity(0.4)",transform:isActive?"scale(1.12)":"scale(1)",transition:"all 0.18s"}}>{t.icon}</div>
              <div style={{fontSize:9,fontFamily:"monospace",letterSpacing:"0.04em",color:isActive?t.color:"#334155",fontWeight:isActive?700:400}}>{t.label}</div>
              {isActive&&<div style={{width:20,height:2,borderRadius:1,background:t.color,marginTop:1}}/>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
